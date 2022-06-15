import React, { useEffect, useState } from "react";

import Tabbar from "./Tabbar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { web3Contract } from "../model/blockchain/blockchainModel";
import {
  getLPFarms,
  getRewardTokenBalance,
  participate,
  setIsLoading,
} from "../redux/slice/blockchainSlice";
import AddNewLP from "./AddNewLP";
import Spinner from "./UI/Spinner";

const MainLayout = () => {
  // #region redux
  const state = useAppSelector((state: RootState) => state.blockchain);
  const dispatch = useAppDispatch();
  // #endregion

  const handleParticipate = (
    contract: web3Contract,
    to: string,
    amount: string
  ) => {
    let from = state.currentAccount;
    dispatch(setIsLoading({ name: contract.address, value: [true] }));
    dispatch(
      participate({
        contracts: [contract, state.RewardToken!],
        contractName: contract.name,
        from: from,
        to: to,
        value: amount,
        web3: state.web3,
      })
    );
  };

  useEffect(() => {
    if (
      state.LPFactory!.contract !== undefined &&
      state.currentAccount !== ""
    ) {
      dispatch(
        getRewardTokenBalance({
          contracts: [state.RewardToken!],
          contractName: "",
          from: state.currentAccount,
          to: "",
          value: 0,
          web3: undefined,
        })
      );
      dispatch(
        getLPFarms({
          contracts: [state.LPFactory!],
          contractName: "",
          from: state.currentAccount,
          to: "",
          web3: state.web3,
          value: state.RewardToken?.address,
        })
      );
    }
  }, [state.LPFactory!.contract, state.currentAccount, state.LPFarms]);

  return (
    <div>
      <div
        id="main"
        className="w-full h-screen bg-zinc-200 flex flex-col justify-between"
      >
        <div className="grid md:grid-cols-2 max-w-[1240px] m-auto">
          <div className="bg-zinc-200 flex flex-col justify-center md:items-start w-full px-2 py-8 sm:mt-10 mt-10 md:mt-0">
            <h1 className="py-3 text-5xl md:text-6xl font-bold">
              Participate {state.selectedPool}
            </h1>

            <div className="flex flex-row">
              <p className="mr-2">Current Address:</p>
              <p className="w-full flex items-center">{state.currentAccount}</p>
            </div>
            <p className="italic text-xs">
              There will be a default 0.1 ETH needed to participate and it will
              be refunded once you withdraw from the pool
            </p>
            <button
              onClick={() =>
                handleParticipate(
                  state.LPFarms?.filter(
                    (x) => x.name === state.selectedPool
                  )[0]!,
                  state.currentAccount,
                  "0.1"
                )
              }
              className="py-3 px-6 w-[100%] z-1 my-4 shadow-xl hover:text-linkedinShade font-bold flex justify-center"
              disabled={
                state.LPFarms!.filter(
                  (x) => x.name === state.selectedPool
                )[0] === undefined || state.currentAccount === ""
                  ? false
                  : state.LPFarms!.filter(
                      (x) => x.name === state.selectedPool
                    )[0].isParticipant ||
                    state.LPFarms!.filter(
                      (x) => x.name === state.selectedPool
                    )[0].isLoading
              }
            >
              {state.LPFarms!.filter(
                (x) => x.name === state.selectedPool
              )[0] === undefined ? (
                "Participate"
              ) : state.LPFarms!.filter((x) => x.name === state.selectedPool)[0]
                  .isLoading ? (
                <Spinner />
              ) : (
                "Participate"
              )}
            </button>
          </div>
          <div className="px-2">
            <Tabbar />
          </div>
        </div>
        <div className="py-2">
          <AddNewLP />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
