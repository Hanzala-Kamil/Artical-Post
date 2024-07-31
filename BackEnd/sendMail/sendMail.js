const nodemailer = require('nodemailer');

const mailSend = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hanzalakamil93@gmail.com',
                pass: 'pbek bwgh apuk prwd',
            },
        });

        const mailOptions = {
            from: 'hanzalakamil93@gmail.com',
            to: email,
            subject: 'This is a One-Time Password. Do not share this with anyone.',
            text: `Your OTP is ${otp}`,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
    } catch (error) {
        return { success: false, error };
    }
};

module.exports = mailSend;
