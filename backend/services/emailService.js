const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const createTransporter = async () => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
        }
    });
};

const sendEmail = async (emailOptions) => {
    try {
        const transporter = await createTransporter();
        await transporter.sendMail(emailOptions);
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
};

module.exports = { sendEmail };