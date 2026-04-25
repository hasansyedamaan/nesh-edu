const mongoose = require('mongoose');

const atlasUri = 'mongodb+srv://nesh:12345@cluster0.umcvgox.mongodb.net/nesh?appName=Cluster0&retryWrites=true&w=majority';

async function testConnection() {
  console.log('Trying to connect to Atlas with options...');
  console.log('URI:', atlasUri.replace('12345', '****'));
  
  try {
    await mongoose.connect(atlasUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      dnsSrvRecordHostname: 'cluster0.umcvgox.mongodb.net'
    });
    console.log('✅ Connected to Atlas!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testConnection();