import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';
dotenv.config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: process.env.USER_NAME,
  key: process.env.API_KEY,
});

export const sendWelcomEmail = async (email, name) => {
  try {
    mg.messages.create(process.env.MG_DOMAIN, {
      from: 'mitulk@webelight.co.in',
      to: email,
      subject: 'Thanks for Joining!',
      text: 'Joining Email',
      html: `<h1>Welcome to the app ${name}. Let me know you're get along with app. </h1>`,
    });
  } catch (error) {
    console.log(error);
  }
};
