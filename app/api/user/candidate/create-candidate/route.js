// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import Candidate from "@/models/candidate";
// import { connect } from "@/lib/dbConfig";
// import { z } from "zod";
// import axios from "axios";

// connect();

// // Zod validation schema
// const applicationSchema = z.object({
//   name: z
//     .string()
//     .min(3, { message: "Full Name must be at least 3 characters long" })
//     .regex(/^[A-Za-z ]+$/, { message: "Full Name can only contain letters" }),
//   location: z
//     .string()
//     .min(1, { message: "Location is required" })
//     .regex(/^[A-Za-z0-9 ]+$/, {
//       message: "Location can only contain letters and numbers",
//     }),
//   email: z.string().email({ message: "Please enter a valid email" }),
//   phone: z
//     .string()
//     .min(1, { message: "Phone Number is required" })
//     .regex(/^\+[0-9]{11,14}$/, {
//       message:
//         "Phone Number must start with + and contain 11 to 14 digits after it",
//     }),
//   currentCompanyName: z
//     .string()
//     .regex(/^[A-Za-z0-9 ]*$/, {
//       message: "Current Company Name can only contain letters and numbers",
//     })
//     .optional(),
//   currentSalary: z
//     .string()
//     .regex(/^\d*$/, {
//       message:
//         "Current Salary must be a number without commas or special characters",
//     })
//     .optional(),
//   totalExperience: z
//     .string()
//     .min(1, { message: "Total Experience is required" }),
//   expectedSalary: z.string().min(1, { message: "Expected Salary is required" }),
//   noticePeriod: z.string().min(1, { message: "Notice Period is required" }),
//   cvLink: z
//     .string()
//     .url({ message: "CV Link must be a valid URL" })
//     .min(1, { message: "CV Link is required" }),
//   remarks: z.string().optional(),
// });

// export async function POST(req) {
//   try {
//     // Validate user authentication
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//     if (!token || !token.id) {
//       return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
//     }

//     // Parse the request body
//     const body = await req.json();
//     console.log("body", body)

//     // Validate the request body using Zod
//     const validationResult = applicationSchema.safeParse(body);
//     if (!validationResult.success) {
//       return NextResponse.json(
//         { error: "Validation failed", details: validationResult.error.format() },
//         { status: 400 }
//       );
//     }

//     // Extract validated data
//     const validatedData = validationResult.data;

//     // Check if a candidate already exists using email or phone
//     const existingCandidates = await Candidate.find({
//       $or: [{ email: validatedData.email }, { phone: validatedData.phone }],
//     });

//     let candidate_id = null;

//     if (existingCandidates.length > 0) {
//       // If multiple matches, prioritize phone match
//       const phoneMatch = existingCandidates.find(c => c.phone === validatedData.phone);
//       candidate_id = phoneMatch ? phoneMatch._id : existingCandidates[0]._id;
//     } else {
//       // No existing candidate, create a new one
//       const candidateData = {
//         ...validatedData,
//         createdBy: token.id,
//         currentSalary: validatedData.currentSalary ? Number(validatedData.currentSalary) : 0,
//       };

//       const newCandidate = await Candidate.create(candidateData);
//       candidate_id = newCandidate._id;
//     }

//     const recruiter_id = token.id;
//     const job_id = body.job_id;
//     const cvLink = body.cvLink

//     // Send candidate_id to application API
//     try {
//       const applicationResponse = await axios.post(
//         // `https://recruiters.jobxity.com/api/application/create-application`,
//         `http://localhost:3000/api/application/create-application`,
//         { recruiter_id, candidate_id, job_id, cvLink },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       if (applicationResponse.status !== 201) {
//         console.error("Failed to create application:", applicationResponse.data);
//         return NextResponse.json({ error: "Candidate processed but failed to apply for job." }, { status: 500 });
//       }
//     } catch (appError) {
//       console.error("Error while creating application:", appError.response?.data || appError.message);
//       return NextResponse.json({ error: "Candidate processed but failed to apply for job." }, { status: 500 });
//     }

//     return NextResponse.json({ candidate_id }, { status: 201 });

//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Recruiter from "@/models/recruiter"; // Candidate is stored in Recruiter with role 5
import Application from "@/models/application"; // 🆕 You were missing this import
import { connect } from "@/lib/dbConfig";
import { z } from "zod";
import mongoose from "mongoose";

connect();

// Zod validation schema
const applicationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Full Name must be at least 3 characters long" })
    .regex(/^[A-Za-z ]+$/, { message: "Full Name can only contain letters" }),
  location: z.string().min(1, { message: "Location is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, "Phone Number is required"),
  currentCompanyName: z
    .string()
    .optional(),
  currentSalary: z
    .string()
    .regex(/^\d*$/, {
      message:
        "Current Salary must be a number without commas or special characters",
    })
    .optional(),
  totalExperience: z
    .string()
    .min(1, { message: "Total Experience is required" }),
  expectedSalary: z.string().min(1, { message: "Expected Salary is required" }),
  noticePeriod: z.string().min(1, { message: "Notice Period is required" }),
  // currentlyApplyingFor: z.string().min(1, { message: "Currently Applying For is required" }),
  cvLink: z
    .string()
    .url({ message: "CV Link must be a valid URL" })
    .min(1, { message: "CV Link is required" }),
  remarks: z.string().optional(),
  job_id: z.string().min(1, { message: "Job ID is required" }),
  recruiter_id: z.string().optional(),
});

export async function POST(req) {
  try {
    await connect();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const body = await req.json();
    console.log("Received body:", body);

    const validationResult = applicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    console.log("Validated data:", validatedData);

    let recruiter_id;

    if (token?.role === "3") {
      recruiter_id = token.id;
    }

    if (
      token?.role === "5" ||
      token?.role === undefined ||
      token?.role === null
    ) {
      recruiter_id = validatedData.recruiter_id;
    }

    const job_id = validatedData.job_id;
    const cvLink = validatedData.cvLink;

    if (
      !mongoose.Types.ObjectId.isValid(recruiter_id) ||
      !mongoose.Types.ObjectId.isValid(job_id)
    ) {
      console.log("--->>>", recruiter_id, job_id);

      return NextResponse.json(
        { error: "Invalid recruiter or job ID" },
        { status: 400 }
      );
    }

    // Check if candidate already exists
    let candidate = await Recruiter.findOne({
      // role: "5",
      $or: [{ email: validatedData.email }, { phone: validatedData.phone }],
    });

    if (!candidate) {
      // Candidate does not exist, create new
      candidate = await Recruiter.create({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        location: validatedData.location,
        currentCompanyName: validatedData.currentCompanyName || "",
        currentSalary: validatedData.currentSalary
          ? Number(validatedData.currentSalary)
          : 0,
        totalExperience: validatedData.totalExperience,
        expectedSalary: validatedData.expectedSalary,
        noticePeriod: validatedData.noticePeriod,
        cv: validatedData.cvLink,
        cvPublicId:body.cvPublicId,
        remarks: validatedData.remarks || "",
        createdBy: recruiter_id,
        role: "5", // Candidate role
      });
    }

    const candidate_id = candidate._id;

    // ✅ Now create Application
    const newApplication = new Application({
      recruiter_id,
      candidate_id,
      job_id,
      cvLink,
      // currentlyApplyingFor: validatedData.currentlyApplyingFor,
      isFromSocialMedia: body?.isFromSocialMedia ?? false,
    });

    await newApplication.save();

    return NextResponse.json(
      {
        message: "Candidate and application created successfully",
        candidate_id,
        application_id: newApplication._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
