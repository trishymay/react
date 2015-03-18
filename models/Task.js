'use strict';

var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  taskBody: String,
  author: {type: String, default: 'Anonymous'}
});

module.exports = mongoose.model('Task', taskSchema);