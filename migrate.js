const mongoose = require('mongoose');

const localUri = 'mongodb://localhost:27017/nesh';
const atlasUri = 'mongodb+srv://nesh:12345@cluster0.umcvgox.mongodb.net/?appName=Cluster0';

async function migrate() {
  console.log('Connecting to local database...');
  await mongoose.connect(localUri);
  
  const db = mongoose.connection.db;
  
  const collections = ['users', 'courses', 'modules', 'lessons', 'enrollments', 'assignments'];
  const data = {};
  
  for (const coll of collections) {
    data[coll] = await db.collection(coll).find({}).toArray();
    console.log(`Exported ${data[coll].length} ${coll}`);
  }
  
  await mongoose.disconnect();
  
  console.log('\nConnecting to Atlas...');
  await mongoose.connect(atlasUri);
  
  const db2 = mongoose.connection.db;
  
  for (const coll of collections) {
    await db2.collection(coll).deleteMany({});
    if (data[coll]?.length) {
      await db2.collection(coll).insertMany(data[coll]);
      console.log(`Imported ${data[coll].length} ${coll}`);
    }
  }
  
  console.log('\n✅ Migration complete!');
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});