import React, { useState } from "react";

import { MenuIcon, XIcon } from "@heroicons/react/outline";
import linkedinIcon from "../assets/images/linkedin-svgrepo-com.svg";
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
    <div className="w-screen h-[80px] z-10 bg-zinc-200 fixed drop-shadlow-lg">
      <div className="px-2 flex justify-between items-center w-full h-full">
        <div className="flex items-center">
          {/* <h1 className="text-3xl font-bold mr-4 sm:text-4xl"></h1> */}
          <img
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://www.linkedin.com/in/colin-lee-181ba7112/",
                "_blank"
              ); //to open new page
            }}
            className="w-[15%] md:w-[10%] mr-0 cursor-pointer"
            src={linkedinIcon}
            alt="/"
          ></img>

          <ul className="hidden md:flex">
            <li className="cursor-pointer">About</li>
            <li className="cursor-pointer">Contact</li>
          </ul>
        </div>
        <div className="hidden md:flex pr-4">
          <button
            onClick={handleConnectWallet}
            className="h-full p-1 border-none bg-green-600 text-justify hover:bg-green-300"
          >
            Connect Wallet
          </button>
        </div>
        <div className="md:hidden" onClick={handleClick}>
          {!nav ? <MenuIcon className="w-5" /> : <XIcon className="w-5" />}
        </div>
      </div>

      <ul className={!nav ? "hidden" : "absolute bg-zinc-200 w-full px-8"}>
        <li className="border-b-2 border-zinc-300 w-full cursor-pointer">
          About
        </li>
        <li className="border-b-2 border-zinc-300 w-full cursor-pointer">
          Contact
        </li>
        <li className="border-b-2 border-zinc-300 w-full cursor-pointer">
          Linkedin
        </li>
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
