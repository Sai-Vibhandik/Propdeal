import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/index.js';
import { sendPasswordResetEmail } from '../utils/email.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Register admin (superadmin only)
// @route   POST /api/auth/register
// @access  Private (superadmin)
export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name,
      role: role || 'admin',
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account',
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, avatar },
      { returnDocument: 'after', runValidators: true }
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate new password strength
    const passwordErrors = [];
    if (newPassword.length < 8) {
      passwordErrors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(newPassword)) {
      passwordErrors.push('at least one uppercase letter');
    }
    if (!/[a-z]/.test(newPassword)) {
      passwordErrors.push('at least one lowercase letter');
    }
    if (!/[0-9]/.test(newPassword)) {
      passwordErrors.push('at least one digit');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      passwordErrors.push('at least one special character');
    }

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Password must contain ${passwordErrors.join(', ')}`,
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Forgot password - Request reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  console.log('=== FORGOT PASSWORD REQUEST ===');
  console.log('Email:', req.body.email);

  try {
    const { email } = req.body;

    if (!email) {
      console.log('ERROR: No email provided');
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    // Find user by email
    console.log('Looking up user by email...');
    const user = await User.findOne({ email });

    if (!user) {
      console.log('No user found with this email (returning success for security)');
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    console.log('User found:', user.email, '| Name:', user.name);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    console.log('Generated reset token');

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    console.log('Token saved to user');

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    console.log('Reset URL:', resetUrl);

    // Send email
    console.log('Attempting to send password reset email...');
    await sendPasswordResetEmail(email, resetUrl, resetToken);
    console.log('Password reset email sent successfully');

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('=== FORGOT PASSWORD ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset link. Please try again.',
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  console.log('=== RESET PASSWORD REQUEST ===');
  console.log('Token:', req.params.token);

  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      console.log('ERROR: Missing token or password');
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }

    // Validate password strength
    const passwordErrors = [];
    if (password.length < 8) {
      passwordErrors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push('at least one digit');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      passwordErrors.push('at least one special character');
    }

    if (passwordErrors.length > 0) {
      console.log('Password validation failed:', passwordErrors);
      return res.status(400).json({
        success: false,
        message: `Password must contain ${passwordErrors.join(', ')}`,
      });
    }

    // Find user with valid token
    console.log('Looking up user with reset token...');
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('ERROR: Invalid or expired reset token');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    console.log('User found:', user.email);

    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successfully for user:', user.email);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('=== RESET PASSWORD ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};