const GoogleChartsNode = require('google-charts-node');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function drawChart() {
  const data = google.visualization.arrayToDataTable([
    ['Status', 'Task Status'],
    ['Completed', 15],
    ['Remaining', 30],
    ['Overdue', 10],
  ]);

  const options = {
    pieHole: 0.4,
    is3D: false,
    legend: { position: 'none', textStyle: { fontSize: 10 } },
    colors: ['Green', 'Blue', 'Red'],
  };

  const chart = new google.visualization.PieChart(container);
  chart.draw(data, options);
}

// Render the chart to image
(async () => {
  const image = await GoogleChartsNode.render(drawChart, {
    width: 400,
    height: 300,
  });

  fs.writeFileSync(path.join(__dirname, '../Charts/dognut.png'), image);
})();
