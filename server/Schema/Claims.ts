import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  email: String,
  claimAmount: Number,
  description: String,
  document: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submissionDate: { type: Date, default: Date.now },
  approvedAmount: Number,
  insurerComments: String,
  reviewedBy: String,
  reviewedDate: { type: Date, default: Date.now },
});

const Claim = mongoose.model('Claim', ClaimSchema);

export default Claim;

