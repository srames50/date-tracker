// server/index.js
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import DateEntry from './models/Date.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5050;

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.post('/api/dates', async (req, res) => {
  console.log('Request body:', req.body); // <--- Add this
  try {
    const newDate = new DateEntry(req.body);
    const saved = await newDate.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log('Error saving date:', err); // <--- Add this
    res.status(400).json({ error: err.message });
  }
});


app.get('/api/dates', async (req, res) => {
  try {
    const dates = await DateEntry.find().sort({ createdAt: -1 }); // latest first
    res.json(dates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/dates/:id', async (req, res) => {
  try {
    const deleted = await DateEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Date not found' });
    res.status(200).json({ message: 'Date deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/dates/:id', async (req, res) => {
  console.log('PUT request to update date with id:', req.params.id);
  console.log('Request body:', req.body);

  try {
    const updated = await DateEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      console.log('No document found with that id');
      return res.status(404).json({ error: 'Date not found' });
    }
    console.log('Successfully updated:', updated);
    res.json(updated);
  } catch (err) {
    console.error('Error during update:', err);
    res.status(400).json({ error: err.message });
  }
});





app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
