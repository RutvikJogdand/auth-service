const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: [
        {
          // Regex pattern to match a general phone number (customize as needed)
          validator: function(value) {
            return /^\d{10}$/.test(value); // Makes sure the phone number is 10 digits long only
          },
          message: props => `${props.value} is not a valid phone number!`
        },
      ],
    trim: true
  },
  country: {
    type: String,
    required: true
  }
});

// Pre-save hook to hash passwords
customerSchema.pre('save', async function (next) {
  // Hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

// Helper method to check the password on login
customerSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
