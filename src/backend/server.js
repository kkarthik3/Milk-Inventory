// MongoDB-based backend server for milk delivery system
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/milkdelivery';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'worker', 'admin'], required: true },
  phone: String,
  address: String,
  routeId: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Milk Variety Schema
const milkVarietySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  pricePerLiter: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const MilkVariety = mongoose.model('MilkVariety', milkVarietySchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  customerAddress: String,
  date: { type: Date, required: true },
  milkType: { type: String, required: true },
  quantity: { type: Number, required: true },
  isExtra: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'delivered', 'missed', 'cancelled'], default: 'pending' },
  routeId: String,
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Route Schema
const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workerName: String,
  areas: [String],
  customerCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Route = mongoose.model('Route', routeSchema);

// Monthly Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  milkType: { type: String, required: true },
  quantity: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  pausedDates: [Date],
  createdAt: { type: Date, default: Date.now }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'milkdelivery_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'milkdelivery_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'milkdelivery_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        routeId: user.routeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Booking Routes
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'customer') {
      filter.customerId = req.user.userId;
    } else if (req.user.role === 'worker') {
      filter.workerId = req.user.userId;
    }
    
    const bookings = await Booking.find(filter).sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { date, milkType, quantity, isExtra } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    const booking = new Booking({
      customerId: req.user.userId,
      customerName: user.name,
      customerAddress: user.address,
      date,
      milkType,
      quantity,
      isExtra,
      routeId: user.routeId || 'default'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Subscription Routes
app.get('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'customer') {
      filter.customerId = req.user.userId;
    }
    
    const subscriptions = await Subscription.find(filter);
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    const subscription = new Subscription({
      ...req.body,
      customerId: req.user.userId
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Milk Variety Routes
app.get('/api/milk-varieties', async (req, res) => {
  try {
    const varieties = await MilkVariety.find();
    res.json(varieties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/milk-varieties', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const variety = new MilkVariety(req.body);
    await variety.save();
    res.status(201).json(variety);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Customer Management Routes (Admin only)
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Worker Management Routes (Admin only)
app.get('/api/workers', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const workers = await User.find({ role: 'worker' }).select('-password');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route Management Routes
app.get('/api/routes', authenticateToken, async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Analytics Routes (Admin only)
app.get('/api/analytics/overview', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const todayOrders = await Booking.countDocuments({
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    });

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          },
          status: 'delivered'
        }
      },
      {
        $lookup: {
          from: 'milkvarieties',
          localField: 'milkType',
          foreignField: 'name',
          as: 'variety'
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $multiply: ['$quantity', { $arrayElemAt: ['$variety.pricePerLiter', 0] }]
            }
          }
        }
      }
    ]);

    res.json({
      totalCustomers,
      totalWorkers,
      todayOrders,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Initialize default data
app.post('/api/init', async (req, res) => {
  try {
    // Create default admin user
    const adminExists = await User.findOne({ email: 'admin@milk.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@milk.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
    }

    // Create default milk varieties
    const varietyCount = await MilkVariety.countDocuments();
    if (varietyCount === 0) {
      const varieties = [
        { name: 'Aavin Green', color: 'bg-green-500', pricePerLiter: 28, stock: 150, description: 'Full cream milk' },
        { name: 'Aavin Blue', color: 'bg-blue-500', pricePerLiter: 26, stock: 100, description: 'Toned milk' },
        { name: 'Aavin Orange', color: 'bg-orange-500', pricePerLiter: 24, stock: 200, description: 'Standardized milk' },
        { name: 'Aavin Purple', color: 'bg-purple-500', pricePerLiter: 22, stock: 75, description: 'Slim milk' },
        { name: 'Aavin Pink', color: 'bg-pink-500', pricePerLiter: 20, stock: 100, description: 'Double toned milk' },
        { name: 'Buttermilk', color: 'bg-yellow-500', pricePerLiter: 15, stock: 80, description: 'Fresh buttermilk' }
      ];
      
      await MilkVariety.insertMany(varieties);
    }

    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Initialization error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;