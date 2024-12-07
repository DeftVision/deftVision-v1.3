const sgMail = require("@sendgrid/mail");

// Set the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = sgMail;
