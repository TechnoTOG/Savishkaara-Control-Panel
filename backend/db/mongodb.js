const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoConnect = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.URI); // No need for deprecated options
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process on connection failure
  }
};

module.exports = mongoConnect;
