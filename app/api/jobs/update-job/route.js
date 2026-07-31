import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Job from "@/models/job"; // Adjust import as needed
import { connect } from "@/lib/dbConfig";

connect();
export async function PUT(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || ![1, 2].includes(Number(token.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Parse the request body
  let data;
  try {
    data = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate required fields
  if (!data.jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  if (!data.fields || typeof data.fields !== 'object' || Object.keys(data.fields).length === 0) {
    return NextResponse.json({ error: "fields object is required and must not be empty" }, { status: 400 });
  }

  // Validate jobId format
  if (!data.jobId.match(/^[0-9a-fA-F]{24}$/)) {
    return NextResponse.json({ error: "Invalid jobId format" }, { status: 400 });
  }

  try {
    // First, check if the job exists and if the user has permission to update it
    const existingJob = await Job.findById(data.jobId);
    
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

 

    // Define allowed fields that can be updated
    const allowedFields = [
      'jobTitle',
      'jobDescription', 
      'skills',
      'jobType',
      'jobMode',
      'requiredExperience',
      'minSalary',
      'maxSalary',
      'managerName',
      'gender',
      'positions',
      'industry',
      'deadline',
      'address',
      'jobStatus'
    ];

    // Filter out fields that are not allowed to be updated
    const updateFields = {};
    for (const [key, value] of Object.entries(data.fields)) {
      if (allowedFields.includes(key)) {
        updateFields[key] = value;
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // Validate specific field types if they're being updated
    if (updateFields.skills && !Array.isArray(updateFields.skills)) {
      return NextResponse.json({ error: "skills must be an array" }, { status: 400 });
    }

    if (updateFields.minSalary && typeof updateFields.minSalary !== "number") {
      return NextResponse.json({ error: "minSalary must be a number" }, { status: 400 });
    }

    if (updateFields.maxSalary && typeof updateFields.maxSalary !== "number") {
      return NextResponse.json({ error: "maxSalary must be a number" }, { status: 400 });
    }

    if (updateFields.positions && typeof updateFields.positions !== "number") {
      return NextResponse.json({ error: "positions must be a number" }, { status: 400 });
    }

    if (updateFields.deadline) {
      const deadlineDate = new Date(updateFields.deadline);
      if (isNaN(deadlineDate.getTime())) {
        return NextResponse.json({ error: "Invalid deadline date" }, { status: 400 });
      }
      updateFields.deadline = Math.floor(deadlineDate.getTime() / 1000);
    }

    if (updateFields.address) {
      const address = updateFields.address;
      const addressRequired = ["country", "state", "city", "completeAddress"];
      for (const field of addressRequired) {
        if (!address[field]) {
          return NextResponse.json({ error: `address.${field} is required` }, { status: 400 });
        }
      }
    }

    // Add updatedAt timestamp
    updateFields.updatedAt = Math.floor(Date.now() / 1000);

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      data.jobId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }

    console.log("Job updated successfully:", updatedJob);
    return NextResponse.json({ 
      message: "Job updated successfully", 
      job: updatedJob 
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating job:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        error: "Validation error", 
        details: validationErrors 
      }, { status: 400 });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return NextResponse.json({ error: "Invalid jobId format" }, { status: 400 });
    }

    return NextResponse.json({ error: "Error updating job" }, { status: 500 });
  }
}
