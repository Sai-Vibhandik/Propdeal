import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  console.log('Creating email transporter...');
  console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? '[SET]' : '[NOT SET]',
    pass: process.env.SMTP_PASS ? '[SET]' : '[NOT SET]',
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
  });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email
export const sendEmail = async ({ to, subject, html, text }) => {
  console.log('=== sendEmail called ===');
  console.log('To:', to);
  console.log('Subject:', subject);

  try {
    const transporter = createTransporter();

    // Verify transporter connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    };

    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('=== EMAIL ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('Full error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl, resetToken) => {
  const subject = 'Password Reset Request - PropDeal';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
          <td style="text-align: center; padding: 40px 0;">
            <h1 style="color: #1e3a8a; margin: 0; font-size: 28px;">PropDeal</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              You requested to reset your password. Click the button below to create a new password:
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
              <tr>
                <td style="text-align: center;">
                  <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #1e3a8a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>
            <p style="color: #6b7280; font-size: 14px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #1e3a8a; font-size: 14px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 4px;">
              ${resetUrl}
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This link will expire in <strong>1 hour</strong>. If you did not request this password reset, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; padding: 30px 0; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} PropDeal. All rights reserved.</p>
            <p style="margin: 10px 0 0 0;">This is an automated email, please do not reply.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Password Reset Request

You requested to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you did not request this password reset, you can safely ignore this email.

© ${new Date().getFullYear()} PropDeal. All rights reserved.
  `.trim();

  return sendEmail({ to: email, subject, html, text });
};

// Send welcome email (for new users)
export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to PropDeal!';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to PropDeal</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
          <td style="text-align: center; padding: 40px 0;">
            <h1 style="color: #1e3a8a; margin: 0; font-size: 28px;">PropDeal</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${name}!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for joining PropDeal. We're excited to have you on board!
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              You can now access all features of our platform. If you have any questions, feel free to reach out to our support team.
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
              <tr>
                <td style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 14px 28px; background-color: #1e3a8a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                    Get Started
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center; padding: 30px 0; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} PropDeal. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
};

export default {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};