'use strict';

const InvoiceGenerator = require('./InvoiceGenerator');
const data = require('./data.json');

const generate = async () => {
  try {
    const ig = new InvoiceGenerator(data);
    await ig.generate();
  } catch (error) {
    console.log(error);
  }
};

module.exports = generate;
