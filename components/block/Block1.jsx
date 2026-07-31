import Image from "next/image";

const Block1 = () => {
  const blockContent = [
    {
      id: 1,
      icon: "/images/resource/work-1.png",
      title: "Upload Your Resume",
      text: "Easily upload your resume so employers can quickly discover your qualifications.",
    },
    {
      id: 2,
      icon: "/images/resource/work-2.png",
      title: "Let Recruiters Shortlist",
      text: "Your profile gets shortlisted by top recruiters actively looking for talent like you.",
    },
    {
      id: 3,
      icon: "/images/resource/work-3.png",
      title: "Get Response ASAP!",
      text: "Once shortlisted, get contacted by employers without delay and start your next opportunity.",
    },
  ];
  
  return (
    <>
      {blockContent.map((item) => (
        <div className="work-block col-lg-4 col-md-6 col-sm-12" key={item.id}>
          <div className="inner-box">
            <figure className="image">
              <Image
                width={105}
                height={113}
                src={item.icon}
                alt="how it works"
              />
            </figure>
            <h5>{item.title}</h5>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Block1;
