import Recruiter from "@/models/recruiter";
import { connect } from "@/lib/dbConfig";
import { getToken } from "next-auth/jwt";

connect();

export async function POST(req) {
  try {
    // Authenticate user
    const token = await getToken({ req });
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Parse request body
    const { _id, bankName, otherBankName, currency, accountNo, accountHolderName, swiftCode } = await req.json();

    if (!_id) {
      return new Response(JSON.stringify({ error: "Recruiter ID is required" }), { status: 400 });
    }

    // Prepare update object
    const updateFields = {
      "bankDetails.bankName": bankName,
      "bankDetails.currency": currency,
      "bankDetails.accountNo": accountNo,
      "bankDetails.accountHolderName": accountHolderName,
      "bankDetails.swiftCode": swiftCode,
    };

    // Add otherBankName only if provided
    if (otherBankName) {
      updateFields["bankDetails.otherBankName"] = otherBankName;
    }

    // Perform update
    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      _id,
      {
        $set: updateFields,
        $inc: { profilePercentage: 15 }, // Increment profilePercentage by 20
      },
      { new: true }
    );

    if (!updatedRecruiter) {
      return new Response(JSON.stringify({ error: "Recruiter not found" }), { status: 404 });
    }

    console.log("Banking details updated:", updatedRecruiter);

    return new Response(JSON.stringify(updatedRecruiter), { status: 200 });
  } catch (error) {
    console.error("Error updating recruiter:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
