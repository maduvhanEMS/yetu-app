const GoogleChartsNode = require('google-charts-node');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function drawChart() {
  const data = google.visualization.arrayToDataTable([
    ['Project', 'Tasks'],
    ['Project Housing', 15],
    ['Scooter project', 30],
    ['Land acquisation project', 10],
  ]);

  const options = {
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

  const chart = new google.visualization.BarChart(container);
  chart.draw(data, options);
}

// Render the chart to image
(async () => {
  const image = await GoogleChartsNode.render(drawChart, {
    width: 500,
    height: 300,
  });

  fs.writeFileSync(path.join(__dirname, '../Charts/barchart.png'), image);
})();
