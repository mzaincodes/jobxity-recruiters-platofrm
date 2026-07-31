"use client";
import React, { useState } from "react";
import ReactModal from "react-modal";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    backgroundColor: "white",
    border: "2px solid blue",
    zIndex: "9999",
    bottom: "auto",
    height: "80vh", // Modal height set to 80% of the viewport height
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflowY: "auto", // Enables vertical scrolling when the content exceeds the height
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const ModalComponent = ({ isOpen, onRequestClose, onConsentChange }) => {
  const afterOpenModal = () => {
    console.log("Modal has opened");
  };
  const [hasConsented, setHasConsented] = useState(false);
  const { data: session } = useSession();

  const handleConsentChange = (e) => {
    const isChecked = e.target.checked;
    setHasConsented(isChecked);
    onConsentChange(isChecked); // Pass the consent state to the parent component
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div
        style={{
          width: "50vw",
          paddingInline: "30px",
          zIndex: "999999",
          backgroundColor: "white",
        }}
      >
        <h2
          style={{ textAlign: "center", fontWeight: "700", color: "#1966d2" }}
        >
          FREELANCE RECRUITER AGREEMENT
        </h2>
        <p className="my-4">I agree to the following terms and conditions:</p>

        <h4 style={{ fontWeight: 700 }}>1. SCOPE OF SERVICES</h4>
        <ol>
          <li>
            1.1. The Freelancer shall provide recruitment services to the
            Company by sourcing, screening, and referring suitable candidates
            for job vacancies as per the Company's requirements.
          </li>
          <li>
            1.2. The Freelancer shall ensure that all candidates referred meet
            the qualifications and experience criteria outlined by the Company.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>2. INDEPENDENT CONTRACTOR STATUS</h4>
        <ol>
          <li>
            2.1. The Freelancer is an independent contractor and not an employee
            of Jobxity “The Agency”.
          </li>
          <li>
            2.2. Nothing in this Agreement shall be construed to create a
            partnership, joint venture, or employer-employee relationship.
          </li>
          <li>
            2.3. The Freelancer shall be solely responsible for any taxes,
            insurance, and regulatory obligations applicable under Pakistani
            laws.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>3. COMMISSION STRUCTURE</h4>
        <ol>
          <li>
            3.1. <b>Commission Entitlement:</b> The Freelancer shall be entitled
            to a compensation agreed prior to any assignment, on the gross
            recruitment fee received by “the agency” from the client for each
            successful hire.
          </li>
          <li>
            3.2. <b>Commission Agreement:</b> The final commission rate for each
            assignment shall be communicated at the time of sharing assignment
            and must be mutually agreed in writing (email is acceptable) prior
            to engagement/commencement of any work.
          </li>
          <li>
            3.3. <b>Payment Currency:</b> Commission will be calculated in the
            client’s local currency.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>4. DEFINITION OF SUCCESSFUL HIRE</h4>
        <ol>
          <li>
            4.1. A successful hire shall be defined as a candidate placed
            through the Freelancer’s efforts who:
            <ol>
              <li>4.1.1. Signs an employment agreement with the client.</li>
              <li>
                4.1.2. Completes 90 calendar days in the role, unless the client
                contract states otherwise.
              </li>
            </ol>
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>5. PAYMENT TERMS</h4>
        <ol>
          <li>
            5.1. The Agency shall release the commission within 14 business days
            of receiving full or any amount from the client, subject to the
            terms of agreement between the Agency and Client.
          </li>
          <li>
            5.2. Freelancers are responsible to pay their own taxes depending on
            the state they live in.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>6. WARRANTY & REPLACEMENTS</h4>
        <ol>
          <li>
            6.1. If a placed candidate voluntarily resigns or is terminated for
            cause within 90 calendar days of joining, the Freelancer is
            obligated to provide a free replacement within 14 calendar days of
            official notice by the Agency.
          </li>
          <li>
            6.2. Failure to provide a suitable replacement within this period
            will result in:
            <ol>
              <li>
                6.2.1. Forfeiture of any pending or future commission related to
                the original hire.
              </li>
              <li>
                6.2.2. A written warning or termination of this Agreement based
                on severity.
              </li>
            </ol>
          </li>
          <li>
            6.3. The Freelancer shall not be entitled to any commission for
            placements that result in:
            <ol>
              <li>6.3.1. Incomplete joining by the candidate,</li>
              <li>
                6.3.2. Voluntary resignation under undisclosed circumstances,
              </li>
              <li>6.3.3. Inability to fulfill verification processes,</li>
              <li>
                6.3.4. Rejections based on reference checks/background issues or
                Resident Status.
              </li>
            </ol>
          </li>
          <li>
            6.4. The Freelancer agrees that the commission becomes payable only
            once a candidate:
            <ol>
              <li>6.4.1. Joins the client successfully,</li>
              <li>
                6.4.2. Completes the mandatory 90-day retention period, and
              </li>
              <li>
                6.4.3. Is not replaced due to any of the reasons listed above.
              </li>
            </ol>
          </li>
          <li>
            6.5. This clause shall remain binding regardless of client feedback,
            unless the Agency decides otherwise in writing.
            <ol>
              <li>
                6.5.1. The warranty and replacement obligation is waived only
                if:
                <ol>
                  <li>
                    6.5.1.1. The client terminates the hire due to restructuring
                    or redundancy, and
                  </li>
                  <li>
                    6.5.1.2. A valid and documented reason is provided by the
                    client.
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>7. CONFIDENTIALITY & NON-COMPETE</h4>
        <ol>
          <li>
            7.1. The Freelancer agrees to keep all candidate and client
            information strictly confidential and not to disclose any
            proprietary information without the Company's prior written consent.
          </li>
          <li>
            7.2. The Freelancer shall not engage in direct recruitment services
            with any clients introduced by the Company for a period of{" "}
            <b>12 months</b> after the termination of this Agreement.
          </li>
          <li>
            7.3. The Freelancer shall not share any business leads, client
            details, or internal processes of the Company with any third party.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>8. TERMINATION</h4>
        <ol>
          <li>
            8.1. Either party may terminate this Agreement with a{" "}
            <b>15-day written notice.</b>
          </li>
          <li>
            8.2. The Company reserves the right to terminate this Agreement
            immediately if the Freelancer engages in any unethical practices,
            breaches confidentiality, or violates the non-compete clause.
          </li>
          <li>
            8.3. Upon termination, other than misconduct, any pending
            commissions due for completed placements shall be settled within the
            next payment cycle.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>9. NO GUARANTEE OF BUSINESS OR WORK</h4>
        <ol>
          <li>
            9.1. The Freelancer acknowledges and agrees that this Agreement does
            not obligate the Agency to:
            <ol>
              <li>
                9.1.1. Assign a specific number of positions or job openings,
              </li>
              <li>
                9.1.2. Provide any minimum workload, business continuity, or
                client support.
              </li>
            </ol>
          </li>
          <li>
            9.2. The Agency shall not be liable for any claims, losses, or
            damages arising due to:
            <ol>
              <li>9.2.1. Lack of work or client inactivity,</li>
              <li>9.2.2. Delay in sharing open positions,</li>
              <li>9.2.3. Market conditions beyond its control.</li>
            </ol>
          </li>
          <li>
            9.3. The Freelancer agrees that they are entering into this
            Agreement on a freelance basis and accept the risk of no guaranteed
            income.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>10. FREELANCER’S OBLIGATION</h4>
        <ol>
          <li>
            10.1.{" "}
            <b>Trade Secrets after termination of Freelancing Agreement</b>
            <ol>
              <li>
                10.1.1. Freelancer shall not at any time or in any manner,
                either directly or indirectly, divulge, disclose or communicate
                to any person, firm, corporation, or other entity in any manner
                whatsoever any information concerning any matters affecting or
                relating to the business of employer, including but not limited
                to any of its customers, prices, operations, plans, or
                processes, whether deemed confidential or not.
              </li>
              <li>
                10.1.2. All data and records, in any medium (written, digital,
                etc.), including documents, plans, and notes shall be the
                property of the agency. The Freelancer shall:
                <ol>
                  <li>10.1.2.1. Use them only for the agency’s benefit,</li>
                  <li>10.1.2.2. Keep them on the agency shared drive,</li>
                  <li>10.1.2.3. Return them upon demand,</li>
                  <li>
                    10.1.2.4. Return them upon termination of the engagement,
                  </li>
                  <li>
                    10.1.2.5. Delete any copies from personal devices upon
                    agency's request.
                  </li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>
          11. GOVERNING LAW & DISPUTE RESOLUTION
        </h4>
        <ol>
          <li>
            11.1. This Agreement shall be governed by and construed in
            accordance with the laws of “the land”.
          </li>
          <li>
            11.2. Any disputes arising out of or in connection with this
            Agreement shall be resolved through good faith negotiations. If
            unresolved, disputes shall be settled through arbitration under the
            law of the land.
          </li>
        </ol>

        <h4 style={{ fontWeight: 700 }}>12. GENERAL PROVISIONS</h4>
        <ol>
          <li>
            12.1. This Agreement constitutes the entire understanding between
            the parties and supersedes any prior agreements or understandings,
            whether written or oral.
          </li>
          <li>
            12.2. Any modifications to this Agreement must be made in writing
            and signed by both parties.
          </li>
          <li>
            12.3. If any provision of this Agreement is found to be invalid or
            unenforceable, the remaining provisions shall continue in full force
            and effect.
          </li>
        </ol>

        {session?.user?.consentDate ? (
          <></>
        ) : (
          <>
            <div className="d-flex justify-content-start gap-3 w-100 ml-4">
              <label>
                <input
                  type="checkbox"
                  style={{
                    height: 15,
                    width: 15,
                  }}
                  checked={hasConsented}
                  onChange={handleConsentChange}
                />
              </label>
              <p>I have read this contract and want to continue.</p>
            </div>

            <button
              onClick={() => {
                if (hasConsented) {
                  onRequestClose();
                } else {
                  alert("Please check the box to proceed.");
                }
              }}
              className="theme-btn btn-style-one px-5 mt-3"
            >
              Proceed
            </button>
          </>
        )}
      </div>
    </ReactModal>
  );
};

export default ModalComponent;
