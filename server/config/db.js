const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/symposium_portal';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`\x1b[32m%s\x1b[0m`, `✓ MongoDB Connected Successfully!`);
    console.log(`\x1b[36m%s\x1b[0m`, `  Host: ${conn.connection.host}`);
    console.log(`\x1b[36m%s\x1b[0m`, `  Database: ${conn.connection.name}`);
    console.log(`\x1b[35m%s\x1b[0m`, `  MongoDB Compass URI: ${uri}`);

    // Auto-clean any obsolete or conflicting indexes on 'registrations' (e.g. ticketId_1 with null duplicate errors)
    try {
      const regCollection = conn.connection.collection('registrations');
      const indexes = await regCollection.indexes();
      for (const idx of indexes) {
        if (idx.name === 'ticketId_1') {
          await regCollection.dropIndex('ticketId_1');
          console.log(`\x1b[33m%s\x1b[0m`, `  ✓ Cleaned obsolete 'ticketId_1' index on registrations`);
        }
      }
    } catch (idxErr) {
      // Index drop error can happen if collection doesn't exist yet, safe to ignore
    }

    return true;
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✗ MongoDB Connection Failed: ${error.message}`);
    console.log(`\x1b[33m%s\x1b[0m`, `  Tip: Ensure MongoDB service is running or open MongoDB Compass and connect to ${uri}`);
    return false;
  }
};

module.exports = connectDB;
