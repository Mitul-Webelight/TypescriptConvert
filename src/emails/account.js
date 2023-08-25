const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'MK',
  key: 'f0f1531fb15355c546c1a21e0ed053bb-f0e50a42-fbf0f1fe',
});

const sendWelcomEmail = async (email, name) => {
  try {
    mg.messages.create('sandbox055f869138764373862cc60ad05ce79e.mailgun.org', {
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

module.exports = {
  sendWelcomEmail,
};
