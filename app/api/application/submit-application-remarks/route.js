import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";

connect();

export async function POST(req) {
  try {
    // Parse the request body
    const { applicationId, addedBy, remarksDescription } = await req.json();

    // Validation checks
    if (!applicationId || !addedBy || !remarksDescription) {
      return NextResponse.json(
        { error: "applicationId, addedBy, and remarksDescription are required" },
        { status: 400 }
      );
    }

    // Fetch the application document by its ID
    const application = await Application.findById(applicationId);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Add a new remark to the application
    application.applicationRemarks.push({
      remarksDescription,
      addedBy,  // The recruiter who added the remark
      addedAt: Math.floor(Date.now() / 1000),  // Current timestamp (Unix timestamp)
    });

    // Save the updated application document
    await application.save();

    // Return success response
    return NextResponse.json({
      message: "Remark added successfully",
      application,
    });
  } catch (error) {
    console.error("Error adding remark:", error);
    return NextResponse.json({ error: "Error adding remark" }, { status: 500 });
  }
}




export async function GET(req) {
    const { searchParams } = new URL(req.url); // Get search parameters from the URL
  
    try {
      // Extract the applicationId from the searchParams
      const applicationId = searchParams.get("applicationId");
  
      if (!applicationId) {
        // If applicationId is not provided, return an error response
        return new NextResponse("Application ID is required", { status: 400 });
      }
  
      // Fetch the application by applicationId and populate the 'addedBy' field to get recruiter name
      const application = await Application.findById(applicationId)
        .populate("applicationRemarks.addedBy", "name") // Populate recruiter name in 'addedBy'
        .lean(); // Use lean() for a plain JavaScript object instead of Mongoose Document
  
      if (!application) {
        // If no application is found with the provided applicationId
        return new NextResponse("Application not found", { status: 404 });
      }
  
      // Extract application remarks with addedBy populated (i.e., recruiter name)
      const applicationRemarks = application.applicationRemarks.map((remark) => ({
        ...remark,
        addedBy: remark.addedBy ? { id: remark.addedBy._id, name: remark.addedBy.name } : null,
      }));
  
      // Return the application remarks with recruiter names
      return new NextResponse(
        JSON.stringify({ applicationRemarks }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching application remarks:", error);
      return new NextResponse("Failed to fetch application remarks", { status: 500 });
    }
  }