import Image from "next/image";
import CopyrightFooter from "./CopyrightFooter";
import FooterContent from "./FooterContent";

const index = ({ footerStyle = "" }) => {
  return (
    <footer className={`main-footer ${footerStyle}`}>
      <div className="auto-container">
        {/* <!--Widgets Section--> */}
        <div className="widgets-section">
          <div className="row">
            <div className="big-column col-xl-4 col-lg-3 col-md-12">
              <div className="footer-column about-widget">
                <div className="logo">
                  <a href="#">
                    <Image
                      width={154}
                      height={50}
                      src="/images/jobxity.png"
                      priority
                      alt="brand"
                    />
                  </a>
                </div>
                <p className="phone-num">
                  🇺🇸 USA – Newark, Delaware, USA
                  <br />
                  Phone: <a href="tel:+13029814645">+1 302 981 4645</a>
                </p>

                <p className="phone-num">
                  🇨🇦 Canada – Ontario, Canada
                  <br />
                  Phone: <a href="tel:+13029814645">+1 302 981 4645</a>
                </p>

                <p className="phone-num">
                  🇵🇰 Pakistan – DHA Phase 6, Defence Raya, Lahore
                  <br />
                  Phone: <a href="tel:+923111911192">+92 318 8495984</a>
                </p>

                <p className="phone-num">
                  📧 Email:{" "}
                  <a href="mailto:recruiters@jobxity.com" className="email">
                  recruiters@jobxity.com
                  </a>
                </p>
              </div>
            </div>
            {/* End footer left widget */}

            <div className="big-column col-xl-8 col-lg-9 col-md-12">
              <div className="row">
                <FooterContent />
              </div>
            </div>
            {/* End col-xl-8 */}
          </div>
        </div>
      </div>
      {/* End auto-container */}

      <CopyrightFooter />
      {/* <!--Bottom--> */}
    </footer>
    //   {/* <!-- End Main Footer --> */}
  );
};

export default index;
