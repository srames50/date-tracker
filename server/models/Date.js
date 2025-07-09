import mongoose from 'mongoose';

const dateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  photoUrls: [String],
  date: { type: Date, default: Date.now }  
}, { timestamps: true }); 


const DateEntry = mongoose.model('DateEntry', dateSchema);

export default DateEntry;