import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export interface web3State {
  currentAccount: string;
  web3: Web3 | undefined;
  RewardToken: web3Contract | undefined;
  LPFactory: LPFactoryModel | undefined;
  LPFarms: LPFarmModel[] | undefined;
  totalClaimedReward: string;
  selectedPool: string;
  currentBlockNumber: number;
  error: ErrorModel;
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
  deposits: string;
  isParticipant: boolean;
  startBlockNumber: string;
  isWithdrawing: boolean;
  isClaimingRewards: boolean;
}

export interface LPFactoryModel extends web3Contract {
  isCreatingFarm: boolean;
}

export interface CreateLPFarmModel extends transactionModel {
  tokenAddress: string;
  rewardProportion: number;
}

export interface FarmDetails {
  address: string;
  contract: Contract;
  rewardProportion: number;
}

export interface ErrorModel {
  message: string;
  header: string;
  isShow: boolean;
}

export const RewardTokenName = "RewardToken";
export const LPFactoryName = "LPFactory";
