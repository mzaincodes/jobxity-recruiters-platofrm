const CopyrightFooter = () => {
  return (
    <div className="copyright-text">
      <p>
        © {new Date().getFullYear()} Jobxity 
        {/* <a
          href="https://themeforest.net/user/ib-themes"
          target="_blank"
          rel="noopener noreferrer"
        >
          ib-themes
        </a> */}
        . All Right Reserved.
      </p>
    </div>
  );
};

export default CopyrightFooter;
