const { model, Schema } = require('mongoose');

const smsSchema = new Schema({
  sms: {
    mobileNumber: {
      type: String,
      required: true,
    },
    signupData: {
      type: Date,
      default: new Date().toISOString,
    },
  },
});

const userSchema = new Schema({
  originalTag: {
    type: String,
    required: true,
  },
  discordUserID: {
    type: String,
    required: true,
  },
  smsData: {
    type: smsSchema,
    required: true,
  },
});

const User = model('User', userSchema);

module.exports = User;
