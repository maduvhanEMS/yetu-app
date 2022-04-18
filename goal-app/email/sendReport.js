const Bulk = require('../models/bulkMail');
const asyncHandler = require('express-async-handler');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    type: 'OAuth2',
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

const emailTemplate = fs.readFileSync(
  path.join(__dirname, '../views/reportTemplate.hbs'),
  'utf8'
);
const template = handlebars.compile(emailTemplate);

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

function date_diff(d1, d2, get_item) {
  var date1 = new Date(d1);
  var date2 = new Date(d2);
  var Difference_In_Time = date1.getTime() - date2.getTime();
  switch (get_item) {
    case 'month':
      return Math.round(Difference_In_Time / (1000 * 3600 * 24 * 30));
    case 'day':
      return Math.round(Difference_In_Time / (1000 * 3600 * 24));
    case 'hour':
      return Math.round(Difference_In_Time / (1000 * 3600));
    case 'minute':
      return Math.round(Difference_In_Time / (1000 * 60));
    case 'second':
      return Math.round(Difference_In_Time / 1000);
    default:
      break;
  }
}

const EmailReports = asyncHandler(async (req, res) => {
  const bulkEmails = await Bulk.find({});

  // get email for reports
  let emails = [];
  for (var i = 0; i < bulkEmails.length; i++) {
    if (bulkEmails[i].name === 'Reports') {
      for (var obj of bulkEmails[i].text) {
        emails.push(obj.text);
      }
    }
  }

  //send email
  let mailOptions = {
    from: process.env.EMAIL,
    to: emails.join(','),
    subject: 'Yetu Investments: Monthly Report',
    attachments: [
      {
        filename: 'yetu.PNG',
        path: path.join(__dirname, '../public/yetu.PNG'),
        cid: 'yetu', //same cid value as in the html img src
      },
      {
        filename: 'twitter-brands.png',
        path: path.join(__dirname, '../public/twitter-brands.png'),
        cid: 'twitter', //same cid value as in the html img src
      },
      {
        filename: 'facebook-brands.png',
        path: path.join(__dirname, '../public/facebook-brands.png'),
        cid: 'facebook', //same cid value as in the html img src
      },
      {
        filename: 'linkedin-brands.png',
        path: path.join(__dirname, '../public/linkedin-brands.png'),
        cid: 'linkedin', //same cid value as in the html img src
      },
      {
        filename: 'instagram-brands.png',
        path: path.join(__dirname, '../public/instagram-brands.png'),
        cid: 'instagram', //same cid value as in the html img src
      },
      {
        filename: 'Projects.pdf',
        path: path.join(__dirname, '../pdf/Projects.pdf'),
        contentType: 'application/pdf',
      },
    ],
    html: template({
      message: `Please see monthly report attached.`,
    }),
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error ' + err);
    } else {
      console.log('Email sent successfully');
      res.json({ status: 'Email sent' });
    }
  });
});

module.exports = EmailReports;
