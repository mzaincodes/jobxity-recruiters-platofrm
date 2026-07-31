"use client";
import Link from "next/link";
import MobileSidebar from "./mobile-sidebar";
import Image from "next/image";
import { useSession } from "next-auth/react";
// import { useUser } from "@/app/context/UserContext";

const MobileMenu = () => {
  const { data: session } = useSession();
  // const { userData, logoutUser } = useUser();

  return (
    // <!-- Main Header-->
    <header className="main-header main-header-mobile">
      <div className="auto-container">
        {/* <!-- Main box --> */}
        <div className="inner-box">
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    width={154}
                    height={50}
                    src="/images/jobxity.png" priority
                    alt="brand"
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <MobileSidebar />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            {session ? (
              <Image
                alt="avatar"
                className="thumb rounded-circle"
                src={
                  session?.user?.image ||
                  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid"
                }
                width={40}
                height={40}
              />
            ) : (
              <div className="login-box">
                <a
                  href="#"
                  className="call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
             Login <i className="bi bi-box-arrow-in-right"></i>
                </a>
              </div>
            )}
            {/* login popup end */}

            <a
              href="#"
              className="mobile-nav-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
            >
              <span className="flaticon-menu-1"></span>
            </a>
            {/* right humberger menu */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileMenu;
