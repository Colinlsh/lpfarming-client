import React, { useState } from "react";
import {
  CloudUploadIcon,
  DatabaseIcon,
  PaperAirplaneIcon,
  ServerIcon,
} from "@heroicons/react/solid";

import logo from "../assets/images/colintech-nobackground.png";
import LPFarms from "./LPFarm";
import Tabbar from "./Tabbar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import {
  LPFarmName50,
  web3Contract,
} from "../model/blockchain/blockchainModel";
import { participate, setIsLoading } from "../redux/slice/blockchainSlice";

const MainLayout = () => {
  // #region redux
  const state = useAppSelector((state: RootState) => state.blockchain);
  const dispatch = useAppDispatch();
  // #endregion

  const [input, setInput] = useState("0");

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleParticipate = (
    contract: web3Contract,
    to: string,
    amount: string
  ) => {
    let from = state.currentAccount;
    dispatch(setIsLoading({ name: contract.name, value: [true] }));
    dispatch(
      participate({
        contracts: [contract.contract!, state.RewardToken?.contract!],
        contractName: contract.name,
        from: from,
        to: to,
        tokenId: "",
        value: amount,
      })
    );
  };
  return (
    <div className="w-full h-screen bg-blue-200 flex flex-col justify-between">
      <div className="grid md:grid-cols-2 max-w-[1240px] m-auto">
        <div className=" bg-blue-400 flex flex-col justify-center md:items-start w-full px-2 py-8">
          <h1 className="py-3 text-5xl md:text-6xl font-bold">
            Participate {state.selectedPool}
          </h1>
          <div className="flex flex-row">
            <p className="mr-2">Address:</p>
            <p className="sm:w-[60%] w-[30%]">{state.currentAccount}</p>
          </div>
          <input
            onChange={(e) => handleInput(e)}
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 w-[100%] text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="number"
            placeholder="Enter an amount"
          ></input>
          <button
            onClick={() =>
              handleParticipate(
                state.LPFarms?.filter((x) => x.name === state.selectedPool)[0]!,
                state.currentAccount,
                input
              )
            }
            className="py-3 px-6 w-[100%] my-4 shadow-xl hover:text-linkedinShade font-bold"
          >
            Participate
          </button>
        </div>
        {/* <div className="flex justify-center">
          <img className="w-full" src={logo} alt="/" />
        </div> */}
        <div>{<Tabbar />}</div>
      </div>
    </div>
  );
};

export default MainLayout;
