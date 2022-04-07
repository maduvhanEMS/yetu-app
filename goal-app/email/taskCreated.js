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
  path.join(__dirname, '../views/overdue.hbs'),
  'utf8'
);
const template = handlebars.compile(emailTemplate);

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

const taskCreated = asyncHandler(async (req, res) => {
  //send email
  let mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Yetu Investments: Task Created',
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
    ],
    html: template({
      user: req.body.user_name.split(' ')[0],
      message: `Please note that the following task has been assigned to you. Link to the task ${req.body.url}`,
      task_name: req.body.task_name,
      objective: req.body.objective,
      startDate: req.body.startDate
        ? moment(req.body.startDate).format('LL')
        : '',
      endDate: moment(req.body.endDate).format('LL'),
      duration: req.body.duration,
      dependencies: req.body.dependencies,
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

module.exports = taskCreated;
