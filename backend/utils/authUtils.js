const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://your-frontend-url/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: '"MomTech" <no-reply@momtech.com>',
    to: email,
    subject: 'Verify Your Email',
    html: `Click <a href="${verificationUrl}">here</a> to verify your email.`
  });
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};