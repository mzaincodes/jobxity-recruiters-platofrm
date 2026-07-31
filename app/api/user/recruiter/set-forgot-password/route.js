import bcrypt from "bcryptjs";
import Recruiter from "@/models/recruiter"; // Adjust this to your actual Recruiter model
import { connect } from "@/lib/dbConfig";
import { NextResponse } from "next/server";

connect();

export async function POST(req) {
  try {
    const { email, password, confirmPassword } = await req.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }

    if (!recruiter.isVerified) {
      return NextResponse.json(
        { error: "Recruiter is not verified" },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    recruiter.password = hashedPassword;
    await recruiter.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


// import bcrypt from "bcryptjs";
// import Recruiter from "@/models/recruiter";
// import Candidate from "@/models/candidate";
// import { connect } from "@/lib/dbConfig";
// import { NextResponse } from "next/server";

// connect();

// export async function POST(req) {
//   try {
//     const { email, password, confirmPassword } = await req.json();

//     if (!email || !password || !confirmPassword) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     if (password !== confirmPassword) {
//       return NextResponse.json(
//         { error: "Passwords do not match" },
//         { status: 400 }
//       );
//     }

//     // Find user in both collections
//     const [recruiter, candidate] = await Promise.all([
//       Recruiter.findOne({ email }),
//       Candidate.findOne({ email }),
//     ]);

//     const user = recruiter || candidate;
//     const userType = recruiter ? "recruiter" : candidate ? "candidate" : null;

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (!user.isVerified) {
//       return NextResponse.json(
//         { error: "User is not verified" },
//         { status: 403 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;

//     await user.save();

//     return NextResponse.json(
//       { message: "Password updated successfully", userType },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating password:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
