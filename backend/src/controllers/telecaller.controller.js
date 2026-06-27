import { User, Property, Lead, Enquiry } from '../models/index.js';
import bcrypt from 'bcryptjs';

// @desc    Get all telecallers
// @route   GET /api/admin/telecallers
// @access  Private (Admin only)
export const getTelecallers = async (req, res) => {
  try {
    const telecallers = await User.find({ role: 'telecaller' })
      .select('-password')
      .sort('-createdAt');

    res.json({
      success: true,
      data: telecallers,
    });
  } catch (error) {
    console.error('Get telecallers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create a new telecaller
// @route   POST /api/admin/telecallers
// @access  Private (Admin only)
export const createTelecaller = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create telecaller
    const telecaller = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'telecaller',
      phone,
    });

    res.status(201).json({
      success: true,
      data: telecaller.toJSON(),
    });
  } catch (error) {
    console.error('Create telecaller error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update a telecaller
// @route   PUT /api/admin/telecallers/:id
// @access  Private (Admin only)
export const updateTelecaller = async (req, res) => {
  try {
    const { name, email, phone, isActive, password } = req.body;

    const updateData = { name, phone, isActive };

    // Only update email if provided and different
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
      updateData.email = email.toLowerCase();
    }

    // Find the telecaller
    const telecaller = await User.findById(req.params.id);

    if (!telecaller) {
      return res.status(404).json({
        success: false,
        message: 'Telecaller not found',
      });
    }

    // Update password if provided
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters',
        });
      }
      telecaller.password = password; // Will be hashed by pre-save hook
    }

    // Update other fields
    if (name) telecaller.name = name;
    if (phone !== undefined) telecaller.phone = phone;
    if (isActive !== undefined) telecaller.isActive = isActive;
    if (email) telecaller.email = email.toLowerCase();

    await telecaller.save();

    res.json({
      success: true,
      data: telecaller.toJSON(),
    });
  } catch (error) {
    console.error('Update telecaller error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete a telecaller
// @route   DELETE /api/admin/telecallers/:id
// @access  Private (Admin only)
export const deleteTelecaller = async (req, res) => {
  try {
    // Remove telecaller from all properties they are assigned to
    await Property.updateMany(
      { assignedTelecallers: req.params.id },
      { $pull: { assignedTelecallers: req.params.id } }
    );

    const telecaller = await User.findByIdAndDelete(req.params.id);

    if (!telecaller) {
      return res.status(404).json({
        success: false,
        message: 'Telecaller not found',
      });
    }

    res.json({
      success: true,
      message: 'Telecaller deleted successfully',
    });
  } catch (error) {
    console.error('Delete telecaller error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reset telecaller password
// @route   PUT /api/admin/telecallers/:id/reset-password
// @access  Private (Admin only)
export const resetTelecallerPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const telecaller = await User.findById(req.params.id);

    if (!telecaller) {
      return res.status(404).json({
        success: false,
        message: 'Telecaller not found',
      });
    }

    telecaller.password = password; // Will be hashed by pre-save hook
    await telecaller.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset telecaller password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get telecaller's assigned properties
// @route   GET /api/telecaller/properties
// @access  Private (Telecaller only)
export const getTelecallerProperties = async (req, res) => {
  try {
    // Find all properties where this telecaller is assigned
    const properties = await Property.find({
      assignedTelecallers: req.user._id,
    })
      .select('name slug address status')
      .populate('assignedTelecallers', 'name email phone');

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error('Get telecaller properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get telecaller's assigned leads
// @route   GET /api/telecaller/leads
// @access  Private (Telecaller only)
export const getTelecallerLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, sort = '-createdAt' } = req.query;

    const query = { assignedTo: req.user._id };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const leads = await Lead.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('propertyId', 'name slug');

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get telecaller leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update lead status (Telecaller)
// @route   PUT /api/telecaller/leads/:id/status
// @access  Private (Telecaller only)
export const updateTelecallerLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ['new', 'in-progress', 'converted', 'lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: new, in-progress, converted, lost',
      });
    }

    // Find lead and verify it belongs to this telecaller
    const lead = await Lead.findOne({
      _id: id,
      assignedTo: req.user._id,
    }).populate('propertyId', 'name slug');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you',
      });
    }

    // Update status
    lead.status = status;
    await lead.save();

    res.json({
      success: true,
      data: lead,
      message: 'Lead status updated successfully',
    });
  } catch (error) {
    console.error('Update telecaller lead status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get telecaller's assigned enquiries (contact form submissions)
// @route   GET /api/telecaller/my-enquiries
// @access  Private (Telecaller only)
export const getTelecallerEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, sort = '-createdAt' } = req.query;

    const query = {
      assignedTo: req.user._id,
    };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const enquiries = await Enquiry.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments(query);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get telecaller enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update enquiry status (Telecaller)
// @route   PUT /api/telecaller/my-enquiries/:id/status
// @access  Private (Telecaller only)
export const updateTelecallerEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ['new', 'in-progress', 'converted', 'lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: new, in-progress, converted, lost',
      });
    }

    // Find enquiry and verify it belongs to this telecaller
    const enquiry = await Enquiry.findOne({
      _id: id,
      assignedTo: req.user._id,
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found or not assigned to you',
      });
    }

    // Update status
    enquiry.status = status;
    await enquiry.save();

    res.json({
      success: true,
      data: enquiry,
      message: 'Enquiry status updated successfully',
    });
  } catch (error) {
    console.error('Update telecaller enquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Export telecaller's leads as CSV
// @route   GET /api/telecaller/my-leads/export
// @access  Private (Telecaller only)
export const exportTelecallerLeads = async (req, res) => {
  try {
    const { status, propertyId, startDate, endDate } = req.query;

    const query = { assignedTo: req.user._id };

    if (status) query.status = status;
    if (propertyId) query.propertyId = propertyId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const leads = await Lead.find(query)
      .populate('propertyId', 'name')
      .sort('-createdAt');

    // Format date helper
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = String(hours).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    };

    // Status label helper
    const getStatusLabel = (status) => {
      const statusLabels = {
        'new': 'New',
        'in-progress': 'In Progress',
        'converted': 'Converted',
        'lost': 'Lost',
      };
      return statusLabels[status] || status || 'New';
    };

    // Format source helper
    const formatSource = (source) => {
      if (!source) return 'Website';
      return source.charAt(0).toUpperCase() + source.slice(1).replace(/-/g, ' ');
    };

    // Escape CSV cell value
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Generate CSV headers
    const csvHeaders = ['Name', 'Phone', 'Email', 'Property', 'Source', 'Status', 'Date'];

    const csvRows = leads.map((lead) => [
      escapeCSV(lead.name),
      escapeCSV(lead.phone),
      escapeCSV(lead.email || ''),
      escapeCSV(lead.propertyId?.name || ''),
      escapeCSV(formatSource(lead.source)),
      escapeCSV(getStatusLabel(lead.status)),
      escapeCSV(formatDate(lead.createdAt)),
    ].join(','));

    const csv = [csvHeaders.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export telecaller leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Export telecaller's enquiries as CSV
// @route   GET /api/telecaller/my-enquiries/export
// @access  Private (Telecaller only)
export const exportTelecallerEnquiries = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = {
      assignedTo: req.user._id,
    };

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const enquiries = await Enquiry.find(query).sort('-createdAt');

    // Format date helper
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = String(hours).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    };

    // Status label helper
    const getStatusLabel = (status) => {
      const statusLabels = {
        'new': 'New',
        'in-progress': 'In Progress',
        'converted': 'Converted',
        'lost': 'Lost',
      };
      return statusLabels[status] || status || 'New';
    };

    // Escape CSV cell value
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Generate CSV headers
    const csvHeaders = ['Name', 'Phone', 'Email', 'Message', 'Status', 'Date'];

    const csvRows = enquiries.map((enquiry) => [
      escapeCSV(enquiry.name),
      escapeCSV(enquiry.phone),
      escapeCSV(enquiry.email || ''),
      escapeCSV(enquiry.message || ''),
      escapeCSV(getStatusLabel(enquiry.status)),
      escapeCSV(formatDate(enquiry.createdAt)),
    ].join(','));

    const csv = [csvHeaders.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=enquiries.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export telecaller enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};