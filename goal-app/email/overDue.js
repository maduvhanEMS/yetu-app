const Task = require('../models/taskModel');
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

const EmailTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({}).populate('user');

  //calculate the overdue
  for (var i = 0; i < tasks.length - 1; i++) {
    var number = date_diff(tasks[i].endDate, new Date(), 'day');
    if (number < 0 && !tasks[i].outcomes) {
      //send email
      let mailOptions = {
        from: process.env.EMAIL,
        to: 'maduvha121@outlook.com',
        subject: 'Yetu Investments: Overdue Tasks',
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
          user: tasks[i].user.name.split(' ')[0],
          message: `Please note that the following task is overdue.`,
          task_name: tasks[i].task_name,
          objective: tasks[i].objective,
          startDate: moment(tasks[i].startDate).format('LL'),
          endDate: moment(tasks[i].endDate).format('LL'),
          duration: number,
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
    }
  }
});

module.exports = EmailTasks;
