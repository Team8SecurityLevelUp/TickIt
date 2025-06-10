import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           
  port: Number(process.env.SMTP_PORT),   
  auth: {
    user: process.env.SMTP_USER,         
    pass: process.env.SMTP_PASSWORD,         
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const info = await transporter.sendMail({
    from: '"TickIt" <no-reply@bbd-grad-project.co.za>',            
    to,                                                
    subject: 'Verify your TickIt account',             
    text: `Your verification code is ${token}`,        
    html: `
      <p>Thank you for signing up!</p>
      <p>Please click the button below to verify your email:</p>
      <a 
        href="https://bbd-grad-project.co.za/api/user/verify-email?email=${encodeURIComponent(to)}&token=${token}"
      >
        Verify Email
      </a>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
};
