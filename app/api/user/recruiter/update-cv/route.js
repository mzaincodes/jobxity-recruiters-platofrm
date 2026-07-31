// app/api/user/recruiter/update-cv/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import { v2 as cloudinary } from "cloudinary";

// initialize DB connection
connect();
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});
export async function POST(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Missing user id in query" },
        { status: 400 }
      );
    }

    // expect { cv, cvPublicId } in body
    const { cv, cvPublicId } = await req.json();
    if (!cv || !cvPublicId) {
      return NextResponse.json(
        { message: "Missing cv or cvPublicId in request body" },
        { status: 400 }
      );
    }
    console.log("Received cv:", id, cv, cvPublicId);

    // 1. Find the recruiter by id
    const recruiter = await Recruiter.findById(id);
    if (!recruiter) {
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }
    const isFirstTimeUploading = !recruiter.cv && !recruiter.cvPublicId;

    // 2. If they already have a CV, delete the old file from Cloudinary
    if (recruiter.cvPublicId) {
      await cloudinary.uploader.destroy(recruiter.cvPublicId, {
        resource_type: "raw",
      });
    }

    // 3. Update the recruiter document
    recruiter.cv = cv;
    recruiter.cvPublicId = cvPublicId;
    if (isFirstTimeUploading) {
      recruiter.profilePercentage = Math.min(recruiter.profilePercentage + 25, 100);
    }
    await recruiter.save();

    // 4. Return success
    return NextResponse.json(
      {
        message: "CV updated successfully",
        cv: recruiter.cv,
        cvPublicId: recruiter.cvPublicId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in update-cv route:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
