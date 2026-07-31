import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Job from "@/models/job"; // Adjust import as needed
import { connect } from "@/lib/dbConfig";

connect();
export async function POST(req) {
  // Validate the user: only allow if role is 1 or 2
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
console.log("Received data:", data);
  // Basic validation for required fields
  const requiredFields = [
    "jobTitle",
    "jobDescription",
    "skills",
    "jobType",
    "requiredExperience",
    "minSalary",
    "maxSalary",
    "currency",
    "managerName",
    "positions",
    "industry",
    "deadline",
    "address",
    "jobMode",
  ];
  for (const field of requiredFields) {
    if (!data[field]) {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }

  // Validate specific fields
  if (!Array.isArray(data.skills)) {
    return NextResponse.json(
      { error: "skills must be an array" },
      { status: 400 }
    );
  }
  if (typeof data.minSalary !== "number") {
    return NextResponse.json(
      { error: "Min salary must be a number" },
      { status: 400 }
    );
  }
  if (typeof data.maxSalary !== "number") {
    return NextResponse.json(
      { error: "Max salary must be a number" },
      { status: 400 }
    );
  }
  if (typeof data.positions !== "number") {
    return NextResponse.json(
      { error: "positions must be a number" },
      { status: 400 }
    );
  }
  const deadlineDate = new Date(data.deadline);
  if (isNaN(deadlineDate.getTime())) {
    return NextResponse.json(
      { error: "Invalid deadline date" },
      { status: 400 }
    );
  }
  const address = data.address || {};
  // Address fields are now optional, no validation needed

  // Prepare the job data; jobPostedBy is set to the authenticated user's id from the token.
  const jobData = {
    jobTitle: data.jobTitle,
    jobDescription: data.jobDescription,
    skills: data.skills,
    jobType: data.jobType,
    jobMode: data.jobMode,
    requiredExperience: data.requiredExperience,
    minSalary: data.minSalary,
    maxSalary: data.maxSalary,
    currency: data.currency,
    managerName: data.managerName,
    gender: data.gender || "",
    positions: data.positions,
    industry: data.industry,
    jobPostedBy: token.id,
    appliedBy: data.appliedBy || [],
    jobStatus: 1,
    deadline: Math.floor(new Date(data.deadline).getTime() / 1000),
    address: {
      country: address.country || "",
      state: address.state || "",
      city: address.city || "",
      postalCode: address.postalCode || "",
      completeAddress: address.completeAddress || "",
    },
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  };

  try {
    const newJob = await Job.create(jobData);
    console.log("Job created successfully:", newJob);
    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Error creating job" }, { status: 500 });
  }
}
