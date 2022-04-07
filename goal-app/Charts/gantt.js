const GoogleChartsNode = require('google-charts-node');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const columns = [
  { type: 'string', label: 'Task ID' },
  { type: 'string', label: 'Task Name' },
  { type: 'string', label: 'Resource' },
  { type: 'date', label: 'Start Date' },
  { type: 'date', label: 'End Date' },
  { type: 'number', label: 'Duration' },
  { type: 'number', label: 'Percent Complete' },
  { type: 'string', label: 'Dependencies' },
];

const rows = [
  [
    'Research',
    'Find sources',
    null,
    new Date(2015, 0, 1),
    new Date(2015, 0, 5),
    null,
    100,
    null,
  ],
  [
    'Write',
    'Write paper',
    'write',
    null,
    new Date(2015, 0, 9),
    3 * 24 * 60 * 60 * 1000,
    25,
    'Research,Outline',
  ],
  [
    'Cite',
    'Create bibliography',
    'write',
    null,
    new Date(2015, 1, 7),
    1 * 24 * 60 * 60 * 1000,
    20,
    'Research',
  ],
  [
    'Complete',
    'Hand in paper',
    'complete',
    null,
    new Date(2015, 1, 10),
    1 * 24 * 60 * 60 * 1000,
    0,
    'Cite,Write',
  ],
  [
    'Outline',
    'Outline paper',
    'write',
    null,
    new Date(2015, 0, 6),
    1 * 24 * 60 * 60 * 1000,
    100,
    'Research',
  ],
];

const drawChart = (rows) => {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Task ID');
  data.addColumn('string', 'Task Name');
  data.addColumn('date', 'Start Date');
  data.addColumn('date', 'End Date');
  data.addColumn('number', 'Duration');
  data.addColumn('number', 'Percent Complete');
  data.addColumn('string', 'Dependencies');

  // add row
  //   const rows = require('./rows');
  for (var i = 0; i < rows.length; i++) {
    data.addRow([
      'Research',
      'Find sources',
      new Date(2015, 0, 1),
      new Date(2015, 0, 5),
      null,
      100,
      null,
    ]);
  }

  const options = {
    gantt: {
      criticalPathEnabled: false,
      innerGridHorizLine: {
        stroke: '#ffe0b2',
        strokeWidth: 2,
      },
      innerGridTrack: { fill: '#fff3e0' },
      innerGridDarkTrack: { fill: '#ffcc80' },
    },
    height: 295,
  };

  const chart = new google.visualization.Gantt(container);
  chart.draw(data, options);
};

// Render the chart to image
(async () => {
  const image = await GoogleChartsNode.render(drawChart, {
    packages: ['gantt'],
    width: 960,
    height: 300,
    rows: rows,
  });

  fs.writeFileSync(path.join(__dirname, '../Charts/gantt.png'), image);
})();
