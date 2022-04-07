const handlebars = require('handlebars');

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');
const router = express.Router();

const emaialTemplate = fs.readFileSync(
  path.join(__dirname, '../public/template/template.hbs'),
  'utf8'
);
const template = handlebars.compile(emaialTemplate);

const htmlToSend = template({ user: 'Hello World!' });

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

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

router.post('/', function (req, res) {
  let mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: 'Yetu Investments: Task Management',
    attachments: [
      {
        filename: 'yetu.PNG',
        path: __dirname + '../assets/imagename.svg',
        cid: 'yetu', //same cid value as in the html img src
      },
    ],
    html: template({
      user: req.body.user_name,
      message: req.body.message,
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

module.exports = router;
