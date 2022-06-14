import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div
      id="footer"
      className="w-full mt-24 bg-slate-900 text-gray-300 py-y px-2"
    >
      <div className="flex flex-col max-w-[1240px] px-2 py-4 mx-auto justify-between sm:flex-row text-center text-gray-500">
        <p className="py-4">2022 Colin Lee @ colinlsh6@gmail.com</p>
        <div className="flex place-content-around sm:w-[300px] pt-4 text-4xl">
          <FaLinkedin
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://www.linkedin.com/in/colin-lee-181ba7112/",
                "_blank"
              ); //to open new page
            }}
          />
          <FaGithub
            onClick={(e) => {
              e.preventDefault();
              window.open("https://github.com/Colinlsh", "_blank"); //to open new page
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
