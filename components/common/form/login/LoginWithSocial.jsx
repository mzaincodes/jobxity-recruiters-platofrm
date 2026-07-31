"use client";
import { signIn } from "next-auth/react";

const LoginWithSocial = () => {
  return (
    <div className=" d-flex justify-content-center align-items-center">
    {/* <div className="col-lg-6 col-md-12">
      <button
        onClick={() => signIn("linkedin")}
        href="#"
        className="theme-btn social-btn-two facebook-btn"
      >
        {" "}
        <i className="fab fa-linkedin-in"></i>Log in via Linkedin{" "}
      </button>
    </div> */}
    {/* <div className="col-lg-12 col-md-12"> */}
      <button
        onClick={() => signIn("google")}
        href="#"
        className="theme-btn social-btn-two google-btn"
      >
        <i className="fab fa-google"></i> Log In via Gmail
      </button>
    {/* </div> */}
  </div>
  );
};

export default LoginWithSocial;
