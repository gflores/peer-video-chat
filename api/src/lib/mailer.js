import nodemailer from "nodemailer";
import logger from "./logger";
import fs from 'fs';
import path from 'path';

let defaultFromAddress = "contact@silverchat.co";
let transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "apikey",
    pass: "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"
  }
});

async function sendRawEmail(recipient, subject, html) {
  let info = await transporter.sendMail({
    from: defaultFromAddress,
    to: recipient,
    subject: subject,
    html: html
  });

  logger.debug("Message sent: %s", info.messageId);
  logger.debug("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function sendHtmlEmail({recipient, subject, templateName, data}){
  var html = await readAndFillHtml(templateName, data );

  let info = await transporter.sendMail({
    from: defaultFromAddress,
    to: recipient,
    subject: subject,
    html: html
  });
}

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