"use client";
import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardRecruitersSidebar from "../../../header/DashboardRecruitersSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import SocialNetworkBox from "./components/SocialNetworkBox";
import ContactInfoBox from "./components/ContactInfoBox";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import { useSession } from "next-auth/react";
import LogoUpload from "./components/my-profile/LogoUpload";

const index = () => {
  const { data: session } = useSession();

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardRecruitersSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="My Profile!" />
          <div
            className="bg-white mb-3 "
            style={{
              paddingInline: "30px",
              height: "auto",
              marginTop: "-40px",
              paddingTop: "20px",
              paddingBottom: "5px",
              borderRadius: "7px",
            }}
          >
            <div className="mb-4 ">
              <h6 className="mb-2">
                {session?.user?.profilePercentage}% Completed
              </h6>
              <div className="progress ">
                <div
                  className="progress-bar progress-bar-striped bg-success progress-bar-animated"
                  role="progressbar"
                  aria-label="Animated striped example"
                  aria-valuenow={session?.user?.profilePercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: `${session?.user?.profilePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              <div className="cv-manager-widget ls-widget">
                <div className="widget-title">
                  <h4>Profile Picture</h4>
                </div>
                <div className="widget-content">
                  <LogoUpload id={session?.user?.id} pic={session?.user?.pic} />
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Basic Details</h4>
                  </div>
                  <MyProfile />
                </div>
              </div>
              {/* <!-- Ls widget --> */}

              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Bank Details</h4>
                  </div>
                  {/* End widget-title */}

                  <div className="widget-content">
                    <SocialNetworkBox />
                  </div>
                </div>
              </div>
              {/* <!-- Ls widget --> */}

              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Address Details</h4>
                  </div>
                  {/* End widget-title */}
                  <div className="widget-content">
                    <ContactInfoBox />
                  </div>
                </div>
              </div>
              {/* <!-- Ls widget --> */}
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
