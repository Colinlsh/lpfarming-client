import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export interface web3State {
  currentAccount: string;
  web3: Web3 | undefined;
  RewardToken: web3Contract | undefined;
  LPFarms: LPFarmModel[] | undefined;
  totalClaimedReward: string;
  selectedPool: string;
  currentBlockNumber: number;
}

export interface web3Contract {
  name: string;
  address: string;
  contract: Contract | undefined;
  totalSupply: number;
  isLoading: boolean;
  currentCount: number;
}

export interface transactionModel {
  contracts: web3Contract[];
  contractName: string;
  from: string;
  to: string;
  value: any;
  web3: Web3 | undefined;
}

export interface getContractModel {
  web3: Web3;
  contractName: string;
}

export interface KeyValuePair {
  name: string;
  value: any[];
}

export interface LPFarmModel extends web3Contract {
  claimedRewards: number;
  expectedYield: number;
  rewardProportion: number;
  deposits: number;
  isParticipant: boolean;
  startBlockNumber: string;
}

export const RewardTokenName = "RewardToken";
export const LPFarmName50 = "LPFarm50";
export const LPFarmName30 = "LPFarm30";
export const LPFarmName20 = "LPFarm20";
export const LPFactoryName = "LPFactory";
