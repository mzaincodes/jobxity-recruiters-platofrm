// import dynamic from "next/dynamic";
// import candidates from "@/data/candidates";
// import candidateResume from "@/data/candidateResume";
// import LoginPopup from "@/components/common/form/login/LoginPopup";
// import FooterDefault from "@/components/footer/common-footer";
// import DefaulHeader from "@/components/header/DefaulHeader";
// import MobileMenu from "@/components/header/MobileMenu";
// import Contact from "@/components/candidates-single-pages/shared-components/Contact";
// import GalleryBox from "@/components/candidates-single-pages/shared-components/GalleryBox";
// import Social from "@/components/candidates-single-pages/social/Social";
// import JobSkills from "@/components/candidates-single-pages/shared-components/JobSkills";
// import AboutVideo from "@/components/candidates-single-pages/shared-components/AboutVideo";
// import Image from "next/image";

// export const metadata = {
//   title:
//     "Candidate Single Dyanmic V3 || Superio - Job Borad React NextJS Template",
//   description: "Superio - Job Borad React NextJS Template",
// };

// const CandidateSingleDynamicV3 = ({ params }) => {
//   const id = params.id;
//   const candidate = candidates.find((item) => item.id == id) || candidate[0];

//   return (
//     <>
//       {/* <!-- Header Span --> */}
//       <span className="header-span"></span>

//       <LoginPopup />
//       {/* End Login Popup Modal */}

//       <DefaulHeader />
//       {/* <!--End Main Header --> */}

//       <MobileMenu />
//       {/* End MobileMenu */}

//       {/* <!-- Job Detail Section --> */}
//       <section className="candidate-detail-section style-three">
//         <div className="upper-box">
//           <div className="auto-container">
//             <div className="candidate-block-six">
//               <div className="inner-box">
//                 <figure className="image">
//                   <Image
//                     width={100}
//                     height={100}
//                     src={candidate?.avatar}
//                     alt="avatar"
//                   />
//                 </figure>
//                 <h4 className="name">{candidate?.name}</h4>
//                 <span className="designation">{candidate?.designation}</span>

//                 <div className="content">
//                   <ul className="post-tags">
//                     {candidate?.tags?.map((val, i) => (
//                       <li key={i}>{val}</li>
//                     ))}
//                   </ul>
//                   {/* End post-tags */}

//                   <ul className="candidate-info">
//                     <li>
//                       <span className="icon flaticon-map-locator"></span>
//                       {candidate?.location}
//                     </li>
//                     <li>
//                       <span className="icon flaticon-money"></span> $
//                       {candidate?.hourlyRate} / hour
//                     </li>
//                     <li>
//                       <span className="icon flaticon-clock"></span> Member
//                       Since,Aug 19, 2020
//                     </li>
//                   </ul>
//                   {/* End candidate-info */}

//                   <div className="btn-box">
//                     <a
//                       className="theme-btn btn-style-one"
//                       href="/images/sample.pdf"
//                       download
//                     >
//                       Download CV
//                     </a>
//                     <button className="bookmark-btn">
//                       <i className="flaticon-bookmark"></i>
//                     </button>
//                   </div>
//                   {/* Download cv box */}
//                 </div>
//                 {/* End .content */}
//               </div>
//             </div>
//             {/*  <!-- Candidate block Five --> */}
//           </div>
//         </div>
//         {/* <!-- Upper Box --> */}

//         <div className="candidate-detail-outer">
//           <div className="auto-container">
//             <div className="row">
//               <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
//                 <aside className="sidebar">
//                   <div className="sidebar-widget">
//                     <div className="widget-content">
//                       <ul className="job-overview">
//                         <li>
//                           <i className="icon icon-calendar"></i>
//                           <h5>Experience:</h5>
//                           <span>0-2 Years</span>
//                         </li>

//                         <li>
//                           <i className="icon icon-expiry"></i>
//                           <h5>Age:</h5>
//                           <span>28-33 Years</span>
//                         </li>

//                         <li>
//                           <i className="icon icon-rate"></i>
//                           <h5>Current Salary:</h5>
//                           <span>11K - 15K</span>
//                         </li>

//                         <li>
//                           <i className="icon icon-salary"></i>
//                           <h5>Expected Salary:</h5>
//                           <span>26K - 30K</span>
//                         </li>

//                         <li>
//                           <i className="icon icon-user-2"></i>
//                           <h5>Gender:</h5>
//                           <span>Female</span>
//                         </li>

//                         <li>
//                           <i className="icon icon-language"></i>
//                           <h5>Language:</h5>
//                           <span>English, German, Spanish</span>
//                         </li>

//                         <li>
//                           <i className="icon icon-degree"></i>
//                           <h5>Education Level:</h5>
//                           <span>Master Degree</span>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   {/* End .sidebar-widget conadidate overview */}

//                   <div className="sidebar-widget social-media-widget">
//                     <h4 className="widget-title">Social media</h4>
//                     <div className="widget-content">
//                       <div className="social-links">
//                         <Social />
//                       </div>
//                     </div>
//                   </div>
//                   {/* End .sidebar-widget social-media-widget */}

//                   <div className="sidebar-widget">
//                     <h4 className="widget-title">Professional Skills</h4>
//                     <div className="widget-content">
//                       <ul className="job-skills">
//                         <JobSkills />
//                       </ul>
//                     </div>
//                   </div>
//                   {/* End .sidebar-widget skill widget */}

//                   <div className="sidebar-widget contact-widget">
//                     <h4 className="widget-title">Contact Us</h4>
//                     <div className="widget-content">
//                       <div className="default-form">
//                         <Contact />
//                       </div>
//                     </div>
//                   </div>
//                   {/* End .sidebar-widget contact-widget */}
//                 </aside>
//                 {/* End .sidebar */}
//               </div>
//               {/* End .sidebar-column */}

//               <div className="content-column col-lg-8 col-md-12 col-sm-12">
//                 <div className="job-detail">
//                   <h4>Candidates About</h4>
//                   <p>
//                     Hello my name is Nicole Wells and web developer from
//                     Portland. In pharetra orci dignissim, blandit mi semper,
//                     ultricies diam. Suspendisse malesuada suscipit nunc non
//                     volutpat. Sed porta nulla id orci laoreet tempor non
//                     consequat enim. Sed vitae aliquam velit. Aliquam ante erat,
//                     blandit at pretium et, accumsan ac est. Integer vehicula
//                     rhoncus molestie. Morbi ornare ipsum sed sem condimentum, et
//                     pulvinar tortor luctus. Suspendisse condimentum lorem ut
//                     elementum aliquam.
//                   </p>
//                   <p>
//                     Mauris nec erat ut libero vulputate pulvinar. Aliquam ante
//                     erat, blandit at pretium et, accumsan ac est. Integer
//                     vehicula rhoncus molestie. Morbi ornare ipsum sed sem
//                     condimentum, et pulvinar tortor luctus. Suspendisse
//                     condimentum lorem ut elementum aliquam. Mauris nec erat ut
//                     libero vulputate pulvinar.
//                   </p>

//                   {/* <!-- Portfolio --> */}
//                   <div className="portfolio-outer">
//                     <div className="row">
//                       <GalleryBox />
//                     </div>
//                   </div>

//                   {/* <!-- Candidate Resume Start --> */}
//                   {candidateResume.map((resume) => (
//                     <div
//                       className={`resume-outer ${resume.themeColor}`}
//                       key={resume.id}
//                     >
//                       <div className="upper-title">
//                         <h4>{resume?.title}</h4>
//                       </div>

//                       {/* <!-- Start Resume BLock --> */}
//                       {resume?.blockList?.map((item) => (
//                         <div className="resume-block" key={item.id}>
//                           <div className="inner">
//                             <span className="name">{item.meta}</span>
//                             <div className="title-box">
//                               <div className="info-box">
//                                 <h3>{item.name}</h3>
//                                 <span>{item.industry}</span>
//                               </div>
//                               <div className="edit-box">
//                                 <span className="year">{item.year}</span>
//                               </div>
//                             </div>
//                             <div className="text">{item.text}</div>
//                           </div>
//                         </div>
//                       ))}

//                       {/* <!-- End Resume BLock --> */}
//                     </div>
//                   ))}
//                   {/* <!-- Candidate Resume End --> */}

//                   <div className="video-outer">
//                     <h4>Intro Video</h4>
//                     <AboutVideo />
//                   </div>
//                   {/* <!-- About Video Box --> */}
//                 </div>
//               </div>
//               {/* End .content-column */}
//             </div>
//           </div>
//         </div>
//         {/* <!-- job-detail-outer--> */}
//       </section>
//       {/* <!-- End Job Detail Section --> */}

//       <FooterDefault footerStyle="alternate5" />
//       {/* <!-- End Main Footer --> */}
//     </>
//   );
// };

// export default dynamic(() => Promise.resolve(CandidateSingleDynamicV3), {
//   ssr: false,
// });



"use client";
import dynamic from "next/dynamic";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import MobileMenu from "@/components/header/MobileMenu";
import DefaulHeader2 from "@/components/header/DefaulHeader2";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  convertTimestampToDate,
  getExperienceLabel,
  getNoticePeriodLabel,
} from "@/utils/helping-func";
import { HashLoader } from "react-spinners";
import ApplicationRemarks from "@/components/my-components/ApplicationRemarks";
import Image from "next/image";
import { BASE_URL } from "@/lib/api";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const CandidateSingleDynamicV1 = ({ params }) => {
  const id = params.id;
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#1966d2");
  const { data: session } = useSession();

  useEffect(() => {
    if (!id || id === "favicon.ico") return;
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/user/candidate/get-candidate/${id}`);
        if (res.status === 200) {
          setCandidate(res?.data?.candidate);
          console.log("ppp", res?.data?.candidate);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJob();
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HashLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container candidate-name">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <Image
                      width={100}
                      height={100}
                      src={candidate?.pic || "/images/user.png"}
                      alt="image"
                    />
                  </figure>
                  <h2>{candidate?.name}</h2>
                </div>

                <div className="btn-box">
                  <a
                    className="theme-btn btn-style-one"
                    href={candidate?.cv}
                    download
                    target="_blank" // This makes the link open in a new tab
                  >
                    View CV
                  </a>
                </div>
              </div>
            </div>
            {/*  <!-- Candidate block Five --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-12 col-md-12 col-sm-12">
                <div className="job-detail"></div>
              </div>
              {/* End .content-column */}

              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div
                  className="sidebar-widget  company-widget col-3 md-col-6 "
                  style={{ minWidth: "350px" }}
                >
                  <div className="widget-content ">
                    <h4 className="mb-5">Candidate Details</h4>
                    <ul className="job-overview">
                      <li>
                        <i className="icon icon-calendar"></i>
                        <h5>Experience:</h5>
                        <span>
                          {getExperienceLabel(candidate?.totalExperience)}{" "}
                        </span>
                      </li>

                      <li>
                        <i className="icon icon-salary"></i>
                        <h5>Current Salary:</h5>
                        <span>
                          {" "}
                          Rs{" "}
                          {Intl.NumberFormat().format(candidate?.currentSalary)}
                          /-
                        </span>
                      </li>
                      <li>
                        <i className="icon icon-salary"></i>
                        <h5>Expected Salary:</h5>
                        <span>
                          {" "}
                          Rs{" "}
                          {Intl.NumberFormat().format(
                            candidate?.expectedSalary
                          )}
                          /-
                        </span>
                      </li>

                      {candidate?.currentCompanyName ? (
                        <li>
                          <i className="icon icon-user-2"></i>
                          <h5>Current Company:</h5>
                          <span> {candidate?.currentCompanyName}</span>
                        </li>
                      ) : null}

                      <li>
                        <i className="icon icon-clock"></i>
                        <h5>Notice Period:</h5>
                        <span>
                          {getNoticePeriodLabel(candidate?.noticePeriod)}
                        </span>
                      </li>
                  
                      <li>
                        <i className="icon icon-location"></i>
                        <h5>Candidate Location:</h5>
                        <span>
                          {candidate?.address
                            ? `${candidate?.address?.city}, ${candidate?.address?.country}`
                            : candidate?.location}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  style={{
                    width: "80%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginLeft: "50px",
                    marginTop: "50px",
                  }}
                  className="align-items-start justify-content-start"
                >
               {candidate?.remarks && candidate?.remarks !== "" && (
  <>
    <h4>O Hunter Remarks</h4>
    <p>{candidate?.remarks}</p>
  </>
)}


                  {session?.user?.role == 1 || 2 ? (
                    <div className="mt-4 w-100">
                      <h4 className="mb-2">Other Information</h4>
                      <div className="table-responsive">
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">
                            Created By Recruiter:
                          </div>
                          <div className="col-6">
                            {
                              candidate?.createdBy
                                ?.name
                            }
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">
                            Created on:
                          </div>
                          <div className="col-6">
                            {convertTimestampToDate(
                              candidate?.createdAt
                            )}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">Email:</div>
                          <div className="col-6">
                            {candidate?.email}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">Phone:</div>
                          <div className="col-6">
                            {candidate?.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* End .sidebar-column */}
            </div>
          
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>

      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(CandidateSingleDynamicV1), {
  ssr: false,
});
