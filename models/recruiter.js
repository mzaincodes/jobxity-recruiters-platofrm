import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema({
  // ROLE 3 RECRUITER
  name: { type: String, required: true, index: true },
  linkedinUrl: { type: String, required: false },
  role: { type: String, required: true },
  consentDate: { type: Number, required: false },

  email: { type: String, unique: true, required: true },
  password: { type: String },
  source: { type: String },
  phone: { type: String },
  recruitingExperience: { type: String },
  totalExperience: { type: String },
  description: { type: String },
  educationLevel: { type: String },
  country: { type: String },
  gender: { type: String },
  pic: { type: String, default: "" },
  sts: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  v_otp: { type: String },
  v_otpExpiry: { type: Number },
  f_otp: { type: String },
  f_otpExpiry: { type: Number },
  profilePercentage: { type: Number, default: 20 },
  address: {
    country: { type: String },
    state: { type: String },
    city: { type: String },
    postalCode: { type: String },
    completeAddress: { type: String },
  },
  bankDetails: {
    bankName: { type: String },
    otherBankName: { type: String },
    currency: { type: String },
    accountNo: { type: String },
    accountHolderName: { type: String },
    swiftCode: { type: String },
  },

  // ROLE 4 CANDIDATE
  location: {
    type: String,
    required: false,
  },
  cv: {
    type: String,
    required: false,
  },
  cvPublicId: {
    type: String,
    required: false,
  },
  picPublicId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter", // Ensure this is a reference to the Recruiter model
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
});

RecruiterSchema.pre("save", function (next) {
  this.updatedAt = Math.floor(Date.now() / 1000);
  next();
});

RecruiterSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Math.floor(Date.now() / 1000) });
  next();
});

RecruiterSchema.index({ name: "text" });

const Recruiter =
  mongoose?.models?.Recruiter || mongoose.model("Recruiter", RecruiterSchema);

export default Recruiter;
