const express = require('express');
const colors = express('colors');
const connectDB = require('./config/db');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const { engine } = require('express-handlebars');
const mail = require('./email');

// const emailTemplate

require('dotenv').config();

connectDB();

const app = express();

//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Serves static files (we need it to import a css file)
app.use(express.static('public'));

app.use('/api/v1/goals', require('./routes/goalRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/tasks', require('./routes/taskRoutes'));
app.use('/api/v1/sendEmail', require('./email/taskCreated'));
app.use('/api/v1/', require('./pdf/reportsData'));

//automate sending emails
// setInterval(require('./email/overDue'), 10000);

// require("./email/overDue");
app.get('/', async (req, res) => {
  res.render(require('./pdf/generatePDF'));
});

// app.get('/', async (req, res) => {
//   res.render(require('./Charts/Dognut'));
// });
// app.use('/api', );
// require('./Charts/Dognut');
// require('./Charts/BarChart');
// require('./Charts/gantt');

const sendOverEmail = () => {};

app.use(errorHandler);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
