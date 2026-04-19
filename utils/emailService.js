const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  // Check if credentials are still the default placeholders
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('\n--- 📧 EMAIL SIMULATION (SMTP not configured) ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    // Extract verification link if present for easier testing
    const linkMatch = html.match(/href="([^"]+)"/);
    if (linkMatch) {
      console.log('🔗 Action Link:', linkMatch[1]);
    }
    console.log('-------------------------------------------------\n');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Shree Academy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e7f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #2563eb; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Shree Academy</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for submitting your admission inquiry to Shree Academy. To ensure we have the correct contact information, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify My Email</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #2563eb;">${verifyUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 14px; color: #6b7280; text-align: center;">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
  await sendEmail(email, 'Verify Your Email - Shree Academy', html);
};

const sendConfirmationEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e7f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #10b981; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Shree Academy</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Admission Confirmed!</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We are pleased to inform you that your admission inquiry has been <strong>approved</strong>.</p>
        <p>Our team will contact you soon with the next steps regarding your enrollment and course details.</p>
        <p>Welcome to Shree Academy!</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 14px; color: #6b7280; text-align: center;">Shree Academy | Excellence in Education</p>
      </div>
    </div>
  `;
  await sendEmail(email, 'Admission Confirmed - Shree Academy', html);
};

const sendRejectionEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e7f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #ef4444; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Shree Academy</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Admission Update</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for your interest in Shree Academy. We have reviewed your admission inquiry.</p>
        <p>Unfortunately, we are unable to approve your inquiry at this time. We appreciate your interest and wish you the best in your future endeavors.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 14px; color: #6b7280; text-align: center;">Shree Academy | Excellence in Education</p>
      </div>
    </div>
  `;
  await sendEmail(email, 'Admission Update - Shree Academy', html);
};

module.exports = {
  sendVerificationEmail,
  sendConfirmationEmail,
  sendRejectionEmail,
};
