const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const { engine } = require('express-handlebars');
const path = require('path');
const generate = require('./pdf/generatePDF');
const barChart = require('./Charts/BarChart');
const dognutChart = require('./Charts/Dognut');
const overdue = require('./email/overDue');
const EmailReports = require('./email/sendReport');

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
app.use('/api/v1/mail', require('./routes/bulkMailRoutes'));
app.use('/api/v1/sendEmail', require('./email/taskCreated'));
// app.use('/api/v1/', require('./pdf/reportsData'));

const generateReport = () => {
  barChart();
  dognutChart();
  overdue();
  setTimeout(() => generate(), 4000);
  setTimeout(() => EmailReports, 150000);
};

//automate sending emails
setInterval(() => generateReport(), 2592000);

//production server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
