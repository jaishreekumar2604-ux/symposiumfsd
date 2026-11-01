const mongoose = require('mongoose');

const connectDB = async () => {
try {
const uri = process.env.MONGODB_URI;


    if (!uri) {
        throw new Error('MONGODB_URI is not defined in .env file');
    }

    const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
    });

    console.log('✓ MongoDB Connected Successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Remove obsolete ticketId index if it exists
    try {
        const regCollection = conn.connection.collection('registrations');
        const indexes = await regCollection.indexes();

        for (const index of indexes) {
            if (index.name === 'ticketId_1') {
                await regCollection.dropIndex('ticketId_1');
                console.log('✓ Removed obsolete ticketId_1 index');
            }
        }
    } catch (indexError) {
        console.log('Index cleanup skipped:', indexError.message);
    }

    return true;

} catch (error) {
    console.error('✗ MongoDB Connection Failed:', error.message);
    throw error;
}


};

module.exports = connectDB;
