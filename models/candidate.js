import mongoose from "mongoose";
const { Schema } = mongoose;
import Recruiter from "@/models/recruiter";

// Define the Candidate schema
const CandidateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: { type: String, required: true },
  location: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "0",
  },
  currentCompanyName: {
    type: String,
    required: false,
  },
  totalExperience: {
    type: String,
    required: false,
  },
  currentSalary: {
    type: Number,
    required: false,
  },
  expectedSalary: {
    type: Number,
    required: false,
  },
  noticePeriod: {
    type: String,
    required: false,
  },
  remarks: {
    type: String,
    required: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Recruiter",
    required: false,
  },
  createdAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
    index: true,
  },
  updatedAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
    index: true,
  },
  isVerified: { type: Boolean, default: false },
  v_otp: { type: String },
  password: { type: String },
  v_otpExpiry: { type: Number },
  f_otp: { type: String },
  f_otpExpiry: { type: Number },
  source: { type: String },
  gender: { type: String, required: false },
  totalExperience: { type: String, required: false },
  educationLevel: { type: String, required: false },
  description: { type: String, required: false },
  linkedinUrl: { type: String, required: false },
});

CandidateSchema.pre("save", function (next) {
  this.updatedAt = Math.floor(Date.now() / 1000);
  next();
});

CandidateSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Math.floor(Date.now() / 1000) });
  next();
});

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);
export default Candidate;
