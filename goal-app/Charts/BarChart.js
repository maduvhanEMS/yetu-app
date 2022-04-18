const GoogleChartsNode = require('google-charts-node');
const express = require('express');
const router = express.Router();
var Goal = require('../models/goalModel');
const fs = require('fs');
const path = require('path');

const { projects } = require('../pdf/data.json');

const drawChart = ` 
  //create the data table
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Project');
  data.addColumn('number', 'Tasks');
  data.addRows( ${JSON.stringify(
    projects.reduce(
      (updated, latest) => [
        ...updated,
        [latest.project_name, latest.numOfTasks],
      ],
      []
    )
  )});
  var options = {
    chartArea: { width: '50%' },
    colors: ['blue'],
    hAxis: {
      title: 'Total Tasks',
      minValue: 0,
    },
    vAxis: {
      title: 'Project Name',
    },
  };

  var chart = new google.visualization.BarChart(container);
  chart.draw(data, options);

`;

// Render the chart to image
const barChart = async () => {
  const image = await GoogleChartsNode.render(drawChart, {
    width: 500,
    height: 300,
  });

  fs.writeFileSync(path.join(__dirname, '../Charts/barchart.png'), image);
};

module.exports = barChart;
