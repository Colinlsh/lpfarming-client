import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export interface web3State {
  currentAccount: string;
  web3: Web3 | undefined;
  RewardToken: web3Contract | undefined;
  LPFarms: web3Contract[] | undefined;
  deposits: number;
  yield: number;
  expectedYield: number;
  selectedPool: string;
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
  contracts: Contract[];
  contractName: string;
  from: string;
  to: string;
  tokenId: string;
  value: any;
}

export interface stakeTokenModel {
  stakecontract: web3Contract;
  lpcontract: web3Contract;
  rewardcontract: web3Contract;
  owner: string;
  value: any;
}

export interface getContractModel {
  web3: Web3;
  contractName: string;
}

export interface KeyValuePair {
  name: string;
  value: any[];
}

export const RewardTokenName = "RewardToken";
export const LPFarmName50 = "LPFarm50";
export const LPFarmName30 = "LPFarm30";
export const LPFarmName20 = "LPFarm20";
export const LPFactoryName = "LPFactory";
