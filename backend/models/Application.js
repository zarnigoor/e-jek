import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mutaxassislik: { type: String, required: true },
  muammoTavsifi: { type: String, required: true },
  status: { type: String, default: 'ochiq' },
  navbatRaqami: { type: Number, default: null }, // Added navbatRaqami with default null
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
