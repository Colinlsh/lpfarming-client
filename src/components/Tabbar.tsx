import React, { useState } from "react";
import {
  LPFarmName20,
  LPFarmName30,
  LPFarmName50,
  web3Contract,
} from "../model/blockchain/blockchainModel";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedPool } from "../redux/slice/blockchainSlice";
import { RootState } from "../redux/store";
import LPFarm from "./LPFarm";

const Tabbar = () => {
  // #region redux
  const state = useAppSelector((state: RootState) => state.blockchain);
  const dispatch = useAppDispatch();
  // #endregion
  const [tabState, setTabState] = useState(1);
  const [contract, setContract] = useState<web3Contract>();

  const handleSelectOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value);
    setTabState(num);
    setSelectedPoolDispatch(num);
  };

  const handleSelectTab = (num: number) => {
    setTabState(num);
    setSelectedPoolDispatch(num);
  };

  const setSelectedPoolDispatch = (num: number) => {
    switch (num) {
      case 1:
        dispatch(setSelectedPool(LPFarmName50));
        break;
      case 2:
        dispatch(setSelectedPool(LPFarmName30));

        break;
      case 3:
        dispatch(setSelectedPool(LPFarmName20));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="sm:hidden relative w-11/12 mx-auto bg-white dark:bg-gray-800 rounded">
        <div className="absolute inset-0 m-auto mr-4 z-0 w-6 h-6">
          <img
            className="icon icon-tabler icon-tabler-selector"
            src="https://tuk-cdn.s3.amazonaws.com/can-uploader/tabs-with-icons-svg1.svg"
            alt="selectors"
          />
        </div>
        <select
          aria-label="Selected tab"
          className="dark:text-white form-select block w-full p-3 border border-gray-300 rounded text-gray-600 appearance-none bg-transparent relative z-10"
          onChange={(e) => handleSelectOption(e)}
          value={tabState}
        >
          <option
            value={1}
            className={
              tabState === 1
                ? "text-sm text-gray-600 selected"
                : "text-sm text-gray-600"
            }
          >
            LP50
          </option>
          <option
            value={2}
            className={
              tabState === 2
                ? "text-sm text-gray-600 selected"
                : "text-sm text-gray-600"
            }
          >
            LP30
          </option>
          <option
            value={3}
            className={
              tabState === 3
                ? "text-sm text-gray-600 selected"
                : "text-sm text-gray-600"
            }
          >
            LP20
          </option>
        </select>
      </div>
      <div className="xl:w-full xl:mx-0 h-12 hidden sm:block bg-white dark:bg-gray-800 shadow rounded">
        <div className="h-full md:space-x-28 sm:space-x-14 px-10">
          <button
            onClick={() => handleSelectTab(1)}
            className={
              tabState === 1
                ? "h-[50%] bg-gray-600 border-0 hover:bg-gray-600 hover:text-white font-bold"
                : "h-full bg-transparent border-0 font-bold"
            }
          >
            LP50
          </button>
          <button
            onClick={() => handleSelectTab(2)}
            className={
              tabState === 2
                ? "h-[50%] drop-shadow-2xl bg-gray-600 border-0 hover:bg-gray-600 hover:text-white font-bold"
                : "h-full bg-transparent border-0 font-bold"
            }
          >
            LP30
          </button>
          <button
            onClick={() => handleSelectTab(3)}
            className={
              tabState === 3
                ? "h-[50%] bg-gray-600 border-0 hover:bg-gray-600 hover:text-white font-bold"
                : "h-full bg-transparent border-0 font-bold"
            }
          >
            LP20
          </button>
        </div>
        {/* <LPFarm /> */}
      </div>
      {/* 
      <div className="xl:w-full xl:mx-0 h-12 hidden sm:block bg-white dark:bg-gray-800  shadow rounded">
        <div className="flex border-b px-5">
          <button
            onClick={handleSelectTab}
            className="focus:outline-none focus:text-indigo-700 dark:focus:text-indigo-400 text-sm border-indigo-700 pt-3 rounded-t text-indigo-700 dark:text-indigo-400 mr-12 cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <img
                className="icon icon-tabler icon-tabler-home"
                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/tabs-with-icons-svg2.svg"
                alt="eye"
              />
              <span className="ml-1 font-normal">LP50</span>
            </div>
            <div className="w-full h-1 bg-indigo-700 rounded-t-md"></div>
          </button>
          <button
            onClick={handleSelectTab}
            className="focus:outline-none focus:text-indigo-700 dark:focus:text-indigo-400  text-sm border-indigo-700 pt-3 rounded-t text-gray-600 mr-12 hover:text-indigo-700 dark:hover:text-indigo-400  dark:text-indigo-400 cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-eye"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="12" cy="12" r="2" />
                <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
              </svg>
              <span className="ml-1 font-normal">LP30</span>
            </div>
            <div className="w-full h-1 bg-indigo-700 rounded-t-md hidden"></div>
          </button>
          <button
            onClick={handleSelectTab}
            className="focus:outline-none focus:text-indigo-700 dark:focus:text-indigo-400  text-sm border-indigo-700 pt-3 rounded-t text-gray-600 mr-12 hover:text-indigo-700 dark:hover:text-indigo-400  dark:text-indigo-400 cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-eye"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="12" cy="12" r="2" />
                <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
              </svg>
              <span className="ml-1 font-normal">LP20</span>
            </div>
            <div className="w-full h-1 bg-indigo-700 rounded-t-md hidden"></div>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Tabbar;
