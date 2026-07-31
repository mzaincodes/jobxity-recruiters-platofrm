import { NextResponse } from "next/server";
import Recruiter from "@/models/recruiter"; // Recruiter model
import { connect } from "@/lib/dbConfig";

connect(); 

export async function POST(req) {
  try {
    const { email, f_otp } = await req.json();

    if (!email || !f_otp) {
      return NextResponse.json({ success: false, message: "Email and f_otp are required" }, { status: 400 });
    }

    // Find the recruiter by email
    const recruiter = await Recruiter.findOne({ email });



    if (!recruiter) {
      return NextResponse.json({ success: false, message: "Recruiter not found" }, { status: 404 });
    }

    if (recruiter.isVerified === false) {
      return NextResponse.json({ success: false, message: "Your account is not verified please again signup with this email" }, { status: 404 });
    }

    // Check if OTP has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (!recruiter.f_otpExpiry || recruiter.f_otpExpiry < currentTime) {
      return NextResponse.json({ success: false, message: "OTP has expired" }, { status: 400 });
    }

    // Check if f_otp matches
    if (recruiter.f_otp !== f_otp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    // Update isVerified field
    recruiter.isVerified = true;
    recruiter.f_otp = undefined; // Clear f_otp after verification
    recruiter.f_otpExpiry = undefined; // Clear expiry time
    await recruiter.save();

    return NextResponse.json({ success: true, message: "f_otp verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("f_otp Verification Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import Recruiter from "@/models/recruiter";
// import Candidate from "@/models/candidate";
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function POST(req) {
//   try {
//     const { email, f_otp } = await req.json();

//     if (!email || !f_otp) {
//       return NextResponse.json(
//         { success: false, message: "Email and f_otp are required" },
//         { status: 400 }
//       );
//     }

//     // Find user in both collections
//     const [recruiter, candidate] = await Promise.all([
//       Recruiter.findOne({ email }),
//       Candidate.findOne({ email }),
//     ]);

//     let user = recruiter || candidate;
//     let userType = recruiter ? "recruiter" : candidate ? "candidate" : null;

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     if (user.isVerified === false) {
//       return NextResponse.json({
//         success: false,
//         message: "Your account is not verified. Please sign up again with this email.",
//       }, { status: 400 });
//     }

//     // Check if OTP has expired
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (!user.f_otpExpiry || user.f_otpExpiry < currentTime) {
//       return NextResponse.json({ success: false, message: "OTP has expired" }, { status: 400 });
//     }

//     // Check if OTP matches
//     if (user.f_otp !== f_otp) {
//       return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
//     }

//     // Clear OTP fields and mark as verified
//     user.isVerified = true;
//     user.f_otp = undefined;
//     user.f_otpExpiry = undefined;
//     await user.save();

//     return NextResponse.json(
//       { success: true, message: "f_otp verified successfully", userType },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("f_otp Verification Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
