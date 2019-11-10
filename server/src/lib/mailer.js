import nodemailer from "nodemailer";
import logger from "./logger";
import fs from 'fs';
import path from 'path';

let transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "azure_42f1c630ff3500e81c56c1759a880d10@azure.com",
    pass: "VerdantLoris!91"
  }
});


async function sendRawEmail(recipient, subject, html) {
  let info = await transporter.sendMail({
    from: 'contact@bankos.com', // sender address
    to: recipient, // list of receivers
    subject: subject, // Subject line
    html: html // html body
  });

  logger.debug("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  logger.debug("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

/**
 * @typedef MailOptions
 * @property {String} recipient
 * @property {String} subject the subject
 * @property {String} templateName the name of the html Template to use without .html
 * @property {Object} data the data object to replace all the templates with the values inside
 * 
 * @param {MailOptions} mailOptions the options for mailing
 */
async function sendHtmlEmail({recipient, subject, templateName, data}){
  var html = await readAndFillHtml(templateName, data );

  let info = await transporter.sendMail({
    from: 'contact@bankos.com', // sender address
    to: recipient, // list of receivers
    subject: subject, // Subject line
    html: html // html body
  });
}

/**
 * 
 * @param {String} templateName 
 * @param {*} data should have the keys of all required things in the html
 * @returns {String} the html string
 */
function readAndFillHtml(templateName, data){
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, `emailTemplates/${templateName}.html`),  (err, fileBuffer) => {
      if (err){
        console.log(err);
        reject(err);
      }
      var html = fileBuffer.toString('utf8');
  
      Object.keys(data).forEach((key, i) => {
        html = html.split(`{{${key}}}`).join(data[key]);
      });
      
      resolve(html);
    })
  });
}

export {
  sendRawEmail,
  sendHtmlEmail
}