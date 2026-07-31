import Subscribe from "../call-to-action/subcribe-box/Subscribe";
import Partner from "../common/partner/Partner";
import Testimonia4 from "../testimonial/Testimonial4";
import JobFeatured5 from "../job-featured/JobFeatured5";
import Hero6 from "../hero/hero-4";
import LoginPopup from "../common/form/login/LoginPopup";
import MobileMenu from "../header/MobileMenu";
import DefaulHeader2 from "../header/DefaulHeader2";
import JobCategorie1 from "../job-categories/JobCategorie1";
import FooterDefault from "../../components/footer/common-footer/index";
import Link from "next/link";
import CallToAction from "../call-to-action/CallToAction";
import Count from "../job-categories/count";
import Blog8 from "../blog/Blog8";

const index = () => {
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

      <Hero6 />

      <section className="job-categories">
        <Count />
        <div className="auto-container mt-5">
          <div className="sec-title text-center">
            <h2>Popular Job Categories</h2>
          </div>
          {/* End sec-title */}
          <div className="row" data-aos="fade-up">
            <JobCategorie1 />
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* <!-- End Job Categories --> */}

      <section className="job-section-five">
        <div className="auto-container">
          <div className="sec-title-outer">
            <div className="sec-title">
              <h2>Recent Jobs</h2>
              <div className="text">
                Know your worth and find the job that qualify your life
              </div>
            </div>
            <a href="/job-list-v5" className="link">
              Browse All <span className="icon fa fa-angle-right"></span>
            </a>
          </div>

          <div className="outer-box" >
            <JobFeatured5 />
          </div>
          <div className="btn-box mt-5" >
            <Link
              href="/job-list-v5"
              className="theme-btn btn-style-one bg-blue"
            >
              <span className="btn-title px-5">Load More Listing</span>
            </Link>
          </div>
        </div>
      </section>
      {/* <!-- End Job Section --> */}

      {/* <CallToAction5 /> */}
      {/* <!--Call To Action --> */}
      <div className="mt-5" data-aos="fade-up">
        <CallToAction />
      </div>

      <section className="testimonial-section style-two">
        <div className="auto-container">
          {/* <!-- Sec Title --> */}
          {/* <div className="sec-title text-center">
            <h2>Testimonials From Our Customers</h2>
            <div className="text">
              Lorem ipsum dolor sit amet elit, sed do eiusmod tempor
            </div>
          </div> */}

          {/* <div className="carousel-outer" data-aos="fade-up">
            <div className="testimonial-carousel-three gap-x25">
              <Testimonia4 />
            </div>
          </div> */}
          {/* End .carousel-outer */}
        </div>
        {/* End auto-container */}
      </section>
      {/* <!-- End Testimonial Section --> */}

      {/* <section className="clients-section alternate2">
        <div className="sponsors-outer" data-aos="fade">
          <ul className="sponsors-carousel">
            <Partner />
          </ul>
        </div>
      </section> */}
      {/* <!-- End Clients Section--> */}

      <section className="news-section style_2">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Blogs</h2>
            <div className="text">
              Fresh job related news content posted each day.
            </div>
          </div>
          {/* End ."sec-title */}
          <div className="row" data-aos="fade-up">
            <Blog8 />
          </div>
        </div>
      </section>
      {/* <!-- End News Section --> */}

      {/* <section className="candidates-section">
        <div className="auto-container">
          <div className="sec-title">
            <h2>Featured Candidates</h2>
            <div className="text">
              Lorem ipsum dolor sit amet elit, sed do eiusmod tempor
            </div>
          </div>

          <div className="carousel-outer" data-aos="fade-up">
            <div className="candidates-carousel default-dots">
              <Candidates />
            </div>
          </div>
        </div>
      </section> */}
      {/* <!-- End Candidates Section --> */}

      {/* <section className="subscribe-section-two">
        <div
          className="background-image"
          style={{ backgroundImage: "url(/images/background/5.png)" }}
        ></div>
        <div className="auto-container wow fadeInUp">
          <div className="sec-title text-center light">
            <h2>Subscribe Our Newsletter</h2>
            <div className="text">
              Advertise your jobs to millions of monthly users and search 15.8
              million
              <br /> CVs in our database.
            </div>
          </div>

          <div className="subscribe-form">
            <Subscribe btnStyle="btn-style-one" />
          </div>
        </div>
      </section> */}
      {/* <!-- End Subscribe Section --> */}

      <footer className="main-footer alternate4">
      <FooterDefault />
      </footer>
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
