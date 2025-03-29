const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fireExtinguisherDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Extinguisher Schema
const ExtinguisherSchema = new mongoose.Schema({
    barcode: String,
    trainNumber: String,
    coachNo: String,
    mfgDate: Date,
    expiryDate: Date,
    batchNumber: String
});
const Extinguisher = mongoose.model('Extinguisher', ExtinguisherSchema);

// Predefined admin credentials (plain text)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'adminkaaka' // Simple password
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Login Route (Simple comparison)
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Protected Routes
app.get('/api/extinguishers', authenticateToken, async (req, res) => {
    const extinguishers = await Extinguisher.find();
    res.json(extinguishers);
});

app.get('/api/extinguishers/:trainNumber', authenticateToken, async (req, res) => {
    const extinguishers = await Extinguisher.find({ trainNumber: req.params.trainNumber });
    res.json(extinguishers);
});

app.post('/api/extinguishers', authenticateToken, async (req, res) => {
    try {
        const newExtinguisher = new Extinguisher(req.body);
        await newExtinguisher.save();
        res.status(201).json(newExtinguisher);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding extinguisher' });
    }
});

app.get('/api/expiring', authenticateToken, async (req, res) => {
    try {
        const currentDate = new Date();
        const thirtyDaysFromNow = new Date(currentDate);
        thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

        console.log('Current Date:', currentDate.toISOString());
        console.log('30 Days From Now:', thirtyDaysFromNow.toISOString());

        const expiring = await Extinguisher.find({
            expiryDate: { 
                $gte: currentDate,
                $lte: thirtyDaysFromNow
            }
        });

        console.log('Expiring Items:', expiring);
        res.json(expiring);
    } catch (error) {
        console.log('Expiring Error:', error);
        res.status(500).json({ message: 'Error fetching expiring items' });
    }
});

app.get('/api/expiring/:trainNumber', authenticateToken, async (req, res) => {
    try {
        const currentDate = new Date('2025-03-27');
        const thirtyDaysFromNow = new Date(currentDate);
        thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

        const expiring = await Extinguisher.find({
            trainNumber: req.params.trainNumber,
            expiryDate: { 
                $gte: currentDate,
                $lte: thirtyDaysFromNow
            }
        });

        console.log(`Expiring Items for Train ${req.params.trainNumber}:`, expiring);
        res.json(expiring);
    } catch (error) {
        console.log('Expiring by Train Error:', error);
        res.status(500).json({ message: 'Error fetching expiring items by train' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));