import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';
dotenv.config();

const userName = process.env.USER_NAME as string
const APIKey = process.env.API_KEY as string
const domainName = process.env.MG_DOMAIN as string

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: userName,
  key: APIKey,
});

export const sendWelcomEmail = async (email: string, name: string) => {
  try {
    mg.messages.create(domainName, {
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
