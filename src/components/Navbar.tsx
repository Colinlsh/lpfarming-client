import React, { useState } from "react";
import { Link, animateScroll as scroll } from "react-scroll";

import { MenuIcon, XIcon } from "@heroicons/react/outline";
import linkedinIcon from "../assets/images/linkedin-svgrepo-com.svg";
import logo from "../assets/images/colintech-nobackground.png";
import { setAccount } from "../redux/slice/blockchainSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Navbar = () => {
  // #region Redux
  var dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.blockchain);
  // #endregion

  const handleConnectWallet = async () => {
    let accounts = await state.web3?.eth.requestAccounts();
    console.log(accounts);
    dispatch(setAccount(accounts![0]));
  };

  const [nav, setNav] = useState(false);

  const handleClick = () => setNav(!nav);
  return (
    <div className="w-screen h-[80px] z-50 bg-zinc-200 fixed drop-shadow-xl">
      <div className="px-2 flex justify-between items-center w-full h-full">
        <div className="flex items-center">
          <Link
            className="mr-0 cursor-pointer w-[15%] md:w-[10%]"
            to="main"
            offset={0}
            duration={500}
            smooth={true}
          >
            <img src={logo} alt="/" />
          </Link>

          <ul className="hidden md:flex">
            <li className="cursor-pointer">
              <Link to="main" offset={0} duration={500} smooth={true}>
                Farm
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link to="footer" offset={-200} duration={500} smooth={true}>
                Contact
              </Link>
            </li>
            <li
              className="cursor-pointer animate-bounce"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "https://www.linkedin.com/in/colin-lee-181ba7112/",
                  "_blank"
                ); //to open new page
              }}
            >
              Linkedin
            </li>
            <li
              className="cursor-pointer animate-bounce"
              onClick={(e) => {
                e.preventDefault();
                window.open("https://github.com/Colinlsh", "_blank"); //to open new page
              }}
            >
              Github
            </li>
          </ul>
        </div>
        {state.currentAccount !== "" ? (
          <></>
        ) : (
          <p>Please connect wallet before you begin......</p>
        )}
        <div className="hidden md:flex pr-4">
          <button
            onClick={handleConnectWallet}
            className={
              state.currentAccount === ""
                ? "h-full p-1 border-none bg-green-600 text-justify hover:bg-green-300 animate-bounce"
                : "h-full p-1 border-none bg-green-600 text-justify hover:bg-green-300"
            }
          >
            Connect Wallet
          </button>
        </div>
        <div className="md:hidden" onClick={handleClick}>
          {!nav ? <MenuIcon className="w-5" /> : <XIcon className="w-5" />}
        </div>
      </div>

      <ul
        className={
          !nav ? "hidden" : "absolute bg-zinc-200 w-full px-8 md:hidden"
        }
      >
        <li className="border-b-2 border-zinc-300 w-full cursor-pointer">
          <Link
            onClick={() => handleClick()}
            to="main"
            offset={0}
            duration={500}
            smooth={true}
          >
            Farm
          </Link>
        </li>
        <li className="border-b-2 border-zinc-300 w-full cursor-pointer">
          <Link
            onClick={() => handleClick()}
            to="footer"
            offset={-200}
            duration={500}
            smooth={true}
          >
            Contact
          </Link>
        </li>
        {/* <li className="border-b-2 border-zinc-300 w-full cursor-pointer">
          Linkedin
        </li> */}
        <div className="flex flex-col my-4">
          <button
            onClick={handleConnectWallet}
            className="bg-transparent text-black px-8 py-3 mb-4"
          >
            Connect Wallet
          </button>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
