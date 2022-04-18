const GoogleChartsNode = require('google-charts-node');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { tasks } = require('../pdf/data.json');

function getDays(d1, d2, get_item) {
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

var taskStatus = [
  tasks.filter((item) => item.outcomes).length,
  tasks.filter(
    (item) => !item.outcomes && getDays(item.endDate, new Date(), 'day') >= 0
  ).length,
  tasks.filter(
    (item) => !item.outcomes && getDays(item.endDate, new Date(), 'day') < 0
  ).length,
];

const drawChart = `
//create the data table
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Status');
  data.addColumn('number', 'Task Status');

  data.addRows([
    ['Completed', ${taskStatus[0]}],
    ['Remaining', ${taskStatus[1]}],
    ['Overdue', ${taskStatus[2]}]])

    var options = {
      pieHole: 0.4,
      is3D: false,
      legend: { position: 'none', textStyle: { fontSize: 10 } },
      colors: ['Green', 'Blue', 'Red'],
    };
  
    var chart = new google.visualization.PieChart(container);
    chart.draw(data, options);
`;

const dognutChart = async () => {
  const image = await GoogleChartsNode.render(drawChart, {
    width: 400,
    height: 300,
  });

  fs.writeFileSync(path.join(__dirname, '../Charts/dognut.png'), image);
};

module.exports = dognutChart;
