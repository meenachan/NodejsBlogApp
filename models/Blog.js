const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  subtext:{
    type: String,
    required: false
  },
  user: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('blogs', BlogSchema);