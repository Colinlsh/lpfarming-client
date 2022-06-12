import React from "react";
import { web3Contract } from "../model/blockchain/blockchainModel";

interface LPFarmProps {
  name: string;
  LP: number;
  contract: web3Contract;
}

const LPFarm: React.FC<LPFarmProps> = ({ name = "", LP = 0, contract }) => {
  return (
    <div className="w-full">
      <p>Amount</p>
      <p>Your reward</p>
      <p></p>
      <p></p>
    </div>
  );
};

export default LPFarm;
