import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createLPFarm } from "../redux/slice/blockchainSlice";
import { RootState } from "../redux/store";
import Spinner from "./UI/Spinner";

const AddNewLP = () => {
  // #region redux
  const state = useAppSelector((state: RootState) => state.blockchain);
  const dispatch = useAppDispatch();
  // #endregion

  const [address, setAddress] = useState(state.RewardToken!.address!);
  const [proportion, setProportion] = useState(0);

  const handleAddressInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setAddress(value);
  };

  const handleProportionInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setProportion(parseInt(value));
  };

  const handleCreateNewLP = (address: string, proportion: number) => {
    dispatch(
      createLPFarm({
        tokenAddress:
          address === undefined ? state.RewardToken!.address! : address,
        rewardProportion: proportion,
        web3: state.web3,
        from: state.currentAccount,
        to: "",
        value: 0,
        contractName: "",
        contracts: [state.LPFactory!],
      })
    );
  };

  return (
    <div className="bg-red-200 px-5">
      <p className="text-3xl font-bold">Create new LP</p>
      Reward Token: {state.RewardToken!.address!}
      <input
        disabled={
          state.LPFactory === undefined
            ? true
            : state.LPFactory!.isCreatingFarm || state.currentAccount === ""
        }
        onChange={(e) => handleProportionInput(e)}
        className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 w-[100%] text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="number"
        placeholder="Enter an reward proportion"
      ></input>
      <button
        onClick={() => handleCreateNewLP(address, proportion)}
        disabled={
          state.LPFactory === undefined
            ? true
            : state.LPFactory!.isCreatingFarm || state.currentAccount === ""
        }
        className="p-2 w-full"
      >
        {state.LPFactory!.isCreatingFarm ? <Spinner /> : "Create LP"}
      </button>
    </div>
  );
};

export default AddNewLP;
