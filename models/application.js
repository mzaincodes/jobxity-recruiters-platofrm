// import mongoose from "mongoose";
// const { Schema } = mongoose;
// import Recruiter from "@/models/recruiter";
// import Candidate from "@/models/candidate";
// import Job from "@/models/job";

// // Define the Application schema
// const ApplicationSchema = new Schema({
//   recruiter_id: {
//     type: Schema.Types.ObjectId,
//     ref: "Recruiter",
//     required: true,
//   },
//   applicationId: {
//     type: Number,
//     unique: true,
//     required: true,
//   },
//   candidate_id: {
//     type: Schema.Types.ObjectId,
//     ref: "Recruiter",
//     required: true,
//   },
//   job_id: {
//     type: Schema.Types.ObjectId,
//     ref: "Job",
//     required: true,
//     index: true,
//   },
//   status: {
//     type: String,
//     required: true,
//     default: "0",
//   },
//   cvLink: {
//     type: String,
//     required: true,
//   },
//   updatedBy: {
//     type: Schema.Types.ObjectId,
//     ref: "Recruiter",
//     required: false,
//   },
//   createdAt: {
//     type: Number,
//     default: () => Math.floor(Date.now() / 1000),
//   },
//   updatedAt: {
//     type: Number,
//     default: () => Math.floor(Date.now() / 1000),
//   },
//   applicationRemarks: [
//     {
//       remarksDescription: {
//         type: String,
//         required: true,
//       },
//       addedBy: {
//         type: Schema.Types.ObjectId,
//         ref: "Recruiter",
//         required: false,
//       },
//       addedAt: {
//         type: Number,
//         required: true,
//         default: () => Math.floor(Date.now() / 1000),
//       },
//     },
//   ],
// });

// // Update the updatedAt field before saving
// ApplicationSchema.pre("save", function (next) {
//   this.updatedAt = Math.floor(Date.now() / 1000);
//   next();
// });

// // Update the updatedAt field before updating
// ApplicationSchema.pre("findOneAndUpdate", function (next) {
//   this.set({ updatedAt: Math.floor(Date.now() / 1000) });
//   next();
// });

// ApplicationSchema.pre("save", async function (next) {
//   if (!this.applicationId) {
//     try {
//       // Find the highest current applicationId in the collection
//       const lastApplication = await this.constructor.findOne()
//         .sort({ applicationId: -1 })  // Sort by descending applicationId
//         .limit(1);

//       // If no application found, this is the first application, set the ID to 1
//       if (!lastApplication) {
//         this.applicationId = 1;
//       } else {
//         // Increment the last applicationId by 1
//         this.applicationId = lastApplication.applicationId + 1;
//       }
//       next();
//     } catch (error) {
//       return next(error);  // Handle any errors in the process
//     }
//   } else {
//     next();  // If applicationId is already set (e.g., on update), proceed
//   }
// });


// const Application =
//   mongoose.models.Application ||
//   mongoose.model("Application", ApplicationSchema);
// export default Application;



import mongoose from "mongoose";
const { Schema } = mongoose;
import Recruiter from "@/models/recruiter";
import Candidate from "@/models/candidate";
import Job from "@/models/job";

// Define the Application schema
const ApplicationSchema = new Schema({
  recruiter_id: {
    type: Schema.Types.ObjectId,
    ref: "Recruiter",
    required: false,
  },
  applicationId: {
    type: Number,
    unique: true,
    required: true,
  },
  candidate_id: {
    type: Schema.Types.ObjectId,
    ref: "Recruiter",  
    required: true,
  },
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
    index: true,
  },
  status: {
    type: String,
    required: true,
    default: "0",
  },
  cvLink: {
    type: String,
    required: true,
  },
  // currentlyApplyingFor: {
  //   type: String,
  //   required: true,
  // },
  isFromSocialMedia: {
    type: Boolean,
    required: true,
    default: false,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Recruiter",
    required: false,
  },
  createdAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  updatedAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  applicationRemarks: [
    {
      remarksDescription: {
        type: String,
        required: true,
      },
      addedBy: {
        type: Schema.Types.ObjectId,
        ref: "Recruiter",
        required: false,
      },
      addedAt: {
        type: Number,
        required: true,
        default: () => Math.floor(Date.now() / 1000),
      },
    },
  ],
});

ApplicationSchema.pre("validate", async function (next) {
  // only on new docs
  if (this.isNew && this.applicationId == null) {
    const last = await this.constructor
      .findOne({ applicationId: { $exists: true } })
      .sort({ applicationId: -1 })
      .select("applicationId")
      .lean();

    this.applicationId = last ? last.applicationId + 1 : 1;
  }

  // always update timestamp
  const now = Math.floor(Date.now() / 1000);
  if (this.isNew)        this.createdAt = now;
  this.updatedAt = now;

  next();
});

// Update the updatedAt field before updating
ApplicationSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Math.floor(Date.now() / 1000) });
  next();
});

const Application =
  mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

export default Application;
