const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({

  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?/gi.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?/gi.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /http[s]?:\/\/[www.]?\w{1,}((\W\w{1,}){1,})?\.\w{2,}[#$]?/gi.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },

  movieId: {
    type: String,
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('movies', movieSchema);
