"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import employerMenuData from "../../data/employerMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ADMIN_MENU } from "@/data/admindata";

const DashboardHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const { data: session } = useSession();

  const changeBackground = () => {
    if (window.scrollY >= 0) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    // <!-- Main Header-->
    <header
      className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""}`}
    >
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    alt="brand"
                    src="/images/jobxity.png" 
                    width={154}
                    height={50}
                    priority
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}
            <div style={{width:"10vw"}}></div>
            <HeaderNavContent />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            {/* <button className="menu-btn">
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
            </button> */}
            {/* wishlisted menu */}

            {/* <button className="menu-btn">
              <span className="icon la la-bell"></span>
            </button> */}
            {/* End notification-icon */}

            {/* <!-- Dashboard Option --> */}

            {session ? (
              <div className="dropdown dashboard-option">
                <a
                  className="dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Image
                    alt="avatar"
                    className="thumb"
                    src={
                      session?.user?.image ||
                      "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid"
                    }
                    width={50}
                    height={50}
                  />
                  <span className="name">{session?.user?.name}</span>
                </a>

                <ul className="dropdown-menu mt-3">
                  {/* {employerMenuData?.map((item) => (
                    <li
                      className={`${
                        isActiveLink(item.routePath, usePathname())
                          ? "active"
                          : ""
                      } mb-1`}
                      key={item.id}
                    > */}
                  <div style={{ padding: "10px" }} onClick={()=>  signOut({ callbackUrl: "/" })}>
                    <Link href={"/"}>
                    <div style={{ display:"flex", alignItems:"center" , justifyContent:"left", gap:"20px", hover:"cursor:pointer" }}>
                    <i className={`la la-sign-out`}></i>
                    <span className="ml-2">Logout</span>
                    </div>
                  
                       
                    </Link>
                  </div>

                  {/* </li>
                  ))} */}
                </ul>
              </div>
            ) : (
              <></>
            )}

            {/* End dropdown */}
          </div>
          {/* End outer-box */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
