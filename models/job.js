import mongoose from "mongoose";
const { Schema } = mongoose;
import Recruiter from "@/models/recruiter";

// Define the Job schema
const JobSchema = new Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  jobMode: {
    type: String,
    required: true,
  },
  requiredExperience: {
    type: String,
    required: true,
  },
  minSalary: {
    type: Number,
    required: true,
  },
  maxSalary: {
    type: Number,
    required: true,
  },
  managerName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  positions: {
    type: Number,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  jobPostedBy: {
    type: Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },
  appliedBy: {
    type: [String],
    required: false,
  },
  jobStatus: {
    type: Number,
    default: 1,
  },
  currency: {
    type: String,
    required: true,
  },
  deadline: {
    type: Number,
    required: true,
  },
  address: {
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    postalCode: { type: String, required: false },
    completeAddress: { type: String, required: false },
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
});

JobSchema.pre("save", function (next) {
  this.updatedAt = Math.floor(Date.now() / 1000);
  next();
});

JobSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Math.floor(Date.now() / 1000) });
  next();
});

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
export default Job;



