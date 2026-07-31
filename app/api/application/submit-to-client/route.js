import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";

connect();

export async function POST(request) {
    
  try {
    // Parse the request body
    const { applicationId, updatedBy } = await request.json();

    // Validate the input
    if (!applicationId || !updatedBy) {
      return new Response("Missing applicationId or updatedBy", { status: 400 });
    }

    // Find the application by its ID
    const application = await Application.findById(applicationId);

    // Check if the application exists
    if (!application) {
      return new Response("Application not found", { status: 404 });
    }

    // Update the application's status and updatedBy field
    application.status = "2";  // Status to be updated to "2"
    application.updatedBy = updatedBy;
    application.updatedAt = Math.floor(Date.now() / 1000); // Update the timestamp

    // Save the updated application
    await application.save();

    // Return a success response
    return new Response(JSON.stringify({ message: "Application status updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating application status:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
