'use strict';

const InvoiceGenerator = require('./InvoiceGenerator');
const data = require('./data.json');

const projectData = [
  {
    projectNo: 1,
    description: 'Project Housing',
    owner: 'Maduvha Nemadandila',
    status: 80,
  },
  {
    projectNo: 2,
    description: 'Scooter project',
    owner: 'Mulweli Mathagu',
    status: 50,
  },
  {
    projectNo: 3,
    description: 'Land acquisation project',
    owner: 'Lucky Ramulongo',
    status: 10,
  },
  {
    projectNo: 4,
    description: 'Service delivery project',
    owner: 'Rendani Moubeleni',
    status: 60,
  },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
  //   {
  //     projectNo: 4,
  //     description: 'Service delivery project',
  //     owner: 'Rendani Moubeleni',
  //     status: 60,
  //   },
];

const ig = new InvoiceGenerator(projectData, data);
ig.generate();
