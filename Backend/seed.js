require('dotenv').config();
const connectDB = require('./db');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');

const seed = async () => {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({});
  await Vehicle.deleteMany({});
  const admin = await User.create({ name: 'Admin', email: 'admin@rent.com', password: 'admin123', role: 'admin' });
  console.log('Admin created:', admin.email, 'password: admin123');

  await Vehicle.create([
    { name: 'Honda CB Shine', type: 'bike', hourlyPrice: 40, details: '125cc bike' },
    { name: 'TVS Scooty Pep+', type: 'scooty', hourlyPrice: 30, details: 'Eco scooty' },
    { name: 'Royal Enfield Classic', type: 'bike', hourlyPrice: 70, details: '350cc classic' }
  ]);
  console.log('Vehicles seeded');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
