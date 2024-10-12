// models/Option.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', // Bu Option modelini Question modeliga bog'laydi
  },
});

const Option = mongoose.model('Option', optionSchema);
module.exports = Option;
