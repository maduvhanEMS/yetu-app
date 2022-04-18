const mongoose = require('mongoose');

const bulkMailSchema = mongoose.Schema({
  name: {
    type: String,
  },
  text: [],
});

module.exports = mongoose.model('Bulk', bulkMailSchema);
