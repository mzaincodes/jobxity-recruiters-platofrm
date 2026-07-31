
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
  location: z
    .string()
    .min(1, { message: "Location is required" })
    .regex(/^[A-Za-z0-9 ]+$/, {
      message: "Location can only contain letters and numbers",
    }),
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

  

    const job_id = validatedData.job_id;
    const cvLink = validatedData.cvLink;

    if (
      !mongoose.Types.ObjectId.isValid(job_id)
    ) {


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
        remarks: validatedData.remarks || "",
        role: "5",
      });
    }

    const candidate_id = candidate._id;

    const newApplication = new Application({
      candidate_id,
      job_id,
      cvLink,
      // currentlyApplyingFor: validatedData.currentlyApplyingFor,
      isFromSocialMedia: false,

    });

    await newApplication.save();

    console.log("firsrfgergfewrgt", newApplication);

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
