// import { NextResponse } from "next/server";
// import { connect } from "@/lib/dbConfig";
// import Recruiter from "@/models/recruiter";
// import bcrypt from "bcryptjs";

// connect();

// export async function POST(req) {
//   try {

//     console.log("Login API got hit");
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Find recruiter in database
//     const recruiter = await Recruiter.findOne({ email });

//     if (!recruiter) {
//       return NextResponse.json(
//         { error: "Email not found" },
//         { status: 401 }
//       );
//     }

//     // Check if the email is verified
//     if (!recruiter.isVerified) {
//       return NextResponse.json(
//         { error: "Email is not verified. Please again sign up." },
//         { status: 403 }
//       );
//     }

//     // Compare hashed passwords
//     const isPasswordValid = await bcrypt.compare(password, recruiter.password);

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Incorrect password" },
//         { status: 401 }
//       );
//     }

//     // Login successful
//     return NextResponse.json(
//       { message: "Login successful", recruiter: { id: recruiter._id, email: recruiter.email, role: recruiter.role } },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Login Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import Candidate from "@/models/candidate";
import bcrypt from "bcryptjs";

connect();

export async function POST(req) {
  try {
    console.log("Login API got hit");

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Search in both collections
    const [recruiter, candidate] = await Promise.all([
      Recruiter.findOne({ email }),
      Candidate.findOne({ email }),
    ]);

    const user = recruiter || candidate;
    const userType = recruiter ? "recruiter" : candidate ? "candidate" : null;

    if (!user) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Email is not verified. Please sign up again." },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Login successful
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          userType,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
