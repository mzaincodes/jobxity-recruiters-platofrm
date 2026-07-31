import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import { v2 as cloudinary } from "cloudinary";

// DB and Cloudinary setup
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
      return NextResponse.json({ message: "Missing user id" }, { status: 400 });
    }

    const { pic, picPublicId } = await req.json();
    console.log("Received pic: 111", pic, picPublicId);

    if (!pic || !picPublicId) {
      return NextResponse.json(
        { message: "Missing pic or picPublicId" },
        { status: 400 }
      );
    }

    const recruiter = await Recruiter.findById(id);
    if (!recruiter) {
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }

    if (recruiter.picPublicId) {
      await cloudinary.uploader.destroy(recruiter.picPublicId, {
        resource_type: "image",
      });
    }
    console.log("Received pic: 222", recruiter.pic, recruiter.picPublicId);
    recruiter.pic = pic;
    recruiter.picPublicId = picPublicId;
    await recruiter.save();

    return NextResponse.json(
      {
        message: "Picture updated successfully",
        pic: recruiter.pic,
        picPublicId: recruiter.picPublicId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating picture:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
