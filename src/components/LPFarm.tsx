import React from "react";
import { LPFarmModel } from "../model/blockchain/blockchainModel";

interface LPFarmProps {
  handleCheckPoint: () => void;
  handleClaimReward: () => void;
  handleWithdraw: () => void;
  LPFarm: LPFarmModel | undefined;
  isParticipant: boolean;
}

const LPFarm: React.FC<LPFarmProps> = ({
  LPFarm,
  handleClaimReward,
  handleWithdraw,
  isParticipant,
}) => {
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
          disabled={!isParticipant || LPFarm!.expectedYield === 0}
          onClick={() => handleClaimReward()}
          className="p-2"
        >
          claim reward
        </button>
        <button
          disabled={!isParticipant}
          onClick={() => handleWithdraw()}
          className="p-2"
        >
          Withdraw participation
        </button>
      </div>
    </div>
  );
};

export default LPFarm;
