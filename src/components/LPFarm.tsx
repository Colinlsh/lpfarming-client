import React from "react";
import { LPFarmModel } from "../model/blockchain/blockchainModel";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { claimRewards, withdraw } from "../redux/slice/blockchainSlice";
import { RootState } from "../redux/store";
import Spinner from "./UI/Spinner";

interface LPFarmProps {
  LPFarm: LPFarmModel | undefined;
  isParticipant: boolean;
}

const LPFarm: React.FC<LPFarmProps> = ({ LPFarm, isParticipant }) => {
  // #region redux
  const state = useAppSelector((state: RootState) => state.blockchain);
  const dispatch = useAppDispatch();
  // #endregion

  const handleClaimReward = () => {
    dispatch(
      claimRewards({
        contracts: [LPFarm!, state.RewardToken!],
        contractName: state.selectedPool,
        from: state.currentAccount,
        to: "",
        value: 0,
        web3: state.web3,
      })
    );
  };

  const handleWithdraw = () => {
    dispatch(
      withdraw({
        contracts: [LPFarm!, state.RewardToken!],
        contractName: state.selectedPool,
        from: state.currentAccount,
        to: "",
        value: 0,
        web3: state.web3,
      })
    );
  };

  return (
    <div className="w-full mt-2">
      <div className="grid grid-cols-2">
        <div className="grid auto-rows-auto flex justify-items-end">
          <p>Reward Proportion: </p>
          <p>Amount deposited: </p>
          <p>Your claimed reward: </p>
          <p>Expected yield: </p>
          <p>Start block number: </p>
        </div>
        <div className="grid auto-rows-auto flex justify-center">
          {LPFarm === undefined ? (
            <>
              <p>0</p>
              <p>0</p>
              <p>0</p>
              <p>0</p>
              <p>0</p>
            </>
          ) : (
            <>
              <p>{LPFarm!.rewardProportion}</p>
              <p>{LPFarm!.deposits}</p>
              <p>{LPFarm!.claimedRewards}</p>
              <p>{LPFarm!.expectedYield}</p>
              <p>{LPFarm!.startBlockNumber}</p>
            </>
          )}
        </div>
      </div>
      <div className="flex place-content-around mt-2">
        <button
          disabled={
            !isParticipant || LPFarm === undefined
              ? true
              : LPFarm!.expectedYield === 0 ||
                LPFarm!.isClaimingRewards ||
                LPFarm!.isWithdrawing
          }
          onClick={() => handleClaimReward()}
          className="p-2 w-[20%] flex justify-center"
        >
          {LPFarm === undefined ? (
            "claim reward"
          ) : LPFarm!.isClaimingRewards ? (
            <Spinner />
          ) : (
            "claim reward"
          )}
        </button>
        <button
          disabled={
            !isParticipant || LPFarm === undefined
              ? true
              : LPFarm!.isWithdrawing || LPFarm!.isClaimingRewards
          }
          onClick={() => handleWithdraw()}
          className="p-2 w-[40%] flex justify-center"
        >
          {LPFarm === undefined ? (
            "Withdraw participation"
          ) : LPFarm!.isWithdrawing ? (
            <Spinner />
          ) : (
            "Withdraw participation"
          )}
        </button>
      </div>
    </div>
  );
};

export default LPFarm;
