import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Slice,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import Web3 from "web3";
import {
  web3State,
  transactionModel,
  getContractModel,
  stakeTokenModel,
  RewardTokenName,
  KeyValuePair,
  LPFactoryName,
  LPFarmName50,
  LPFarmName30,
  LPFarmName20,
  web3Contract,
} from "../../model/blockchain/blockchainModel";

import LPFactory from "../../blockchain/build/LPFactory.json";
import LPDeployer from "../../blockchain/build/LPDeployer.json";
import LPFarm from "../../blockchain/build/LPFarm.json";
import RewardToken from "../../blockchain/build/RewardToken.json";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
const contract = require("@truffle/contract");

const contractObject = [
  {
    name: LPFarmName50,
    value: {
      abi: LPFarm,
      address: "0xD35ad2b3bEAd1BA37bA86be185146973Cd3f5255",
    },
  },
  {
    name: LPFarmName30,
    value: {
      abi: LPFarm,
      address: "0x63838e3a893757725F6337C40D4549055CcA368B",
    },
  },
  {
    name: LPFarmName20,
    value: {
      abi: LPFarm,
      address: "0x75C070346b3bF51ABB0047e4014966BB3631231E",
    },
  },
  {
    name: LPFactoryName,
    value: {
      abi: LPFactory,
      address: "",
    },
  },
  {
    name: RewardTokenName,
    value: {
      abi: RewardToken,
      address: "",
    },
  },
];

// #region Async thunk
export const getWeb3 = createAsyncThunk("blockchain/getWeb3", async () => {
  const _web3 = new Web3(
    Web3.givenProvider ||
      new Web3.providers.WebsocketProvider(process.env.REACT_APP_LOCAL_GANACHE!)
  );

  return _web3;
});

export const getContract = createAsyncThunk(
  "blockchain/getContract",
  async (params: getContractModel) => {
    let { web3, contractName } = params;
    let _conJson = contractObject.filter(
      (x) => x.name === contractName
    )[0] as any;
    let id = await web3.eth.net.getId();

    let deployedNetwork, _contract, address;

    if (!contractName.includes("LPFarm")) {
      deployedNetwork = _conJson.value.abi.networks[id];
      _contract = new web3.eth.Contract(
        _conJson.value.abi.abi as AbiItem[],
        deployedNetwork && deployedNetwork.address
      );
      address = deployedNetwork.address;
    } else {
      const _Contract = contract(_conJson.value.abi);

      _Contract.setProvider(web3.currentProvider);

      _contract = await _Contract.at(_conJson.value.address);

      address = _conJson.value.address;
    }

    return { name: contractName, value: [_contract, address] } as KeyValuePair;
  }
);

export const getContractTotalSupply = createAsyncThunk(
  "blockchain/getContractTotalSupply",
  async (contract: Contract) => {
    let num = await contract.methods.totalSupply().call();
    let name = await contract.methods.name().call();
    return { name: name, value: [num] } as KeyValuePair;
  }
);

// export const getAddressTokenCount = createAsyncThunk(
//   "blockchain/getAddressTokenCount",
//   async (transactionModel: transactionModel) => {
//     let { contracts, from, to, tokenId, value } = transactionModel;
//     let name = await contracts[0].methods.name().call();
//     let num;
//     if (!name.includes("LPFarm")) {
//       num = await contracts[0].methods.balanceOf(from).call();
//     } else {
//       num = await contracts[0].methods.providerStakingTokenBalance(from).call();
//     }

//     return { name: name, value: [num] } as KeyValuePair;
//   }
// );

// export const transferToken = createAsyncThunk(
//   "blockchain/transferToken",
//   async (transferModel: transactionModel) => {
//     let name = await transferModel.contract.methods.name().call();
//     // transfer from token
//     await transferModel.contract.methods
//       .transfer(
//         transferModel.to,
//         Web3.utils.toWei(transferModel.value, "ether")
//       )
//       .send({ from: transferModel.from });

//     let _totalSupply = await transferModel.contract.methods
//       .totalSupply()
//       .call();

//     let _currentCount = await transferModel.contract.methods
//       .balanceOf(transferModel.from)
//       .call();

//     return { name: name, value: [_totalSupply, _currentCount] } as KeyValuePair;
//   }
// );

export const participate = createAsyncThunk(
  "blockchain/participate",
  async (transferModel: transactionModel) => {
    try {
      const _lpContract = transferModel.contracts[0];
      await _lpContract.methods.participate().send({
        from: transferModel.from,
        value: Web3.utils.toWei(transferModel.value, "ether"),
      });

      let _depositedAmt = await _lpContract.methods
        .deposits()
        .call({ from: transferModel.from });

      let _rewardTokensAmt = await transferModel.contracts[1].methods
        .balanceOf()
        .call({ from: transferModel.from });

      return {
        name: transferModel.contractName,
        value: [_depositedAmt, _rewardTokensAmt],
      } as KeyValuePair;
    } catch (error) {
      console.log(error);
    }

    return {
      name: transferModel.contractName,
      value: [0, 0],
    } as KeyValuePair;
  }
);

export const stakeToken = createAsyncThunk(
  "blockchain/stakeToken",
  async (stakeTokenModel: stakeTokenModel) => {
    let _stakeContract = stakeTokenModel.stakecontract!.contract!;
    let _lpcontract = stakeTokenModel.lpcontract!.contract!;
    try {
      // approve token farm to withdraw from staketoken contract for that particular address
      await _stakeContract.methods
        .approve(
          stakeTokenModel.lpcontract.address,
          Web3.utils.toWei(stakeTokenModel.value, "ether")
        )
        .send({ from: stakeTokenModel.owner });

      // token farm contract will take from stake contract
      await _lpcontract.methods
        .deposit(Web3.utils.toWei(stakeTokenModel.value, "ether"))
        .send({
          from: stakeTokenModel.owner,
        });
    } catch (error) {
      console.log(error);
    }
    let stakeTokenAmt = await _stakeContract.methods
      .balanceOf(stakeTokenModel.owner)
      .call();

    let lpFarmTokenAmt = await _lpcontract.methods
      .stakingBalance(stakeTokenModel.owner)
      .call();

    return {
      name: "staketoken",
      value: [stakeTokenAmt, lpFarmTokenAmt],
    } as KeyValuePair;
  }
);

export const withdraw = createAsyncThunk(
  "blockchain/withdraw",
  async (stakeTokenModel: stakeTokenModel) => {
    let _stakeContract = stakeTokenModel.stakecontract!.contract!;
    let _lpcontract = stakeTokenModel.lpcontract!.contract!;
    try {
      // unstake token
      await _lpcontract.methods
        .withdraw(Web3.utils.toWei(stakeTokenModel.value, "ether"))
        .send({
          from: stakeTokenModel.owner,
        });
    } catch (error) {
      console.log(error);
    }
    let stakeTokenAmt = await _stakeContract.methods
      .balanceOf(stakeTokenModel.owner)
      .call();

    let lpFarmTokenAmt = await _lpcontract.methods
      .stakingBalance(stakeTokenModel.owner)
      .call();

    let _yield = await _lpcontract.methods
      .claimedRewards(stakeTokenModel.owner)
      .call();

    return {
      name: "withdraw",
      value: [stakeTokenAmt, _yield, lpFarmTokenAmt],
    } as KeyValuePair;
  }
);

export const claimRewards = createAsyncThunk(
  "blockchain/withdrawYield",
  async (stakeTokenModel: stakeTokenModel) => {
    let _stakeContract = stakeTokenModel.stakecontract!.contract!;
    let _lpcontract = stakeTokenModel.lpcontract!.contract!;
    try {
      await _lpcontract.methods.claimRewards().send({
        from: stakeTokenModel.owner,
      });
    } catch (error) {
      console.log(error);
    }
    let stakeTokenAmt = await _stakeContract.methods
      .balanceOf(stakeTokenModel.owner)
      .call();

    let _yield = await _lpcontract.methods
      .rewardTokenBalance(stakeTokenModel.owner)
      .call();

    return {
      name: "withdrawYield",
      value: [stakeTokenAmt, _yield],
    } as KeyValuePair;
  }
);

export const checkpoint = createAsyncThunk(
  "blockchain/checkpoint",
  async (transferModel: transactionModel) => {
    let name, _yield;
    try {
      name = await transferModel.contracts[0].methods.name().call();

      // trigger to calculate expected yield
      await transferModel.contracts[0].methods
        .checkpoint()
        .send({ from: transferModel.from });

      // get expected yield
      _yield = await transferModel.contracts[0].methods
        .expectedYield(transferModel.from)
        .call();
    } catch (error) {
      console.log(error);
    }
    return { name: name, value: [_yield] } as KeyValuePair;
  }
);

const blockchainSlice: Slice<
  web3State,
  SliceCaseReducers<web3State>,
  "blockchain"
> = createSlice({
  name: "blockchain",
  initialState: {
    currentAccount: "",
    web3: undefined,
    LPFarms: [] as web3Contract[],
    RewardToken: {
      name: RewardTokenName,
      contract: undefined,
      totalSupply: 0,
      isLoading: false,
      currentCount: 0,
    },
    deposits: 0,
    yield: 0,
    expectedYield: 0,
    selectedPool: "-",
  } as web3State,
  reducers: {
    setAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<KeyValuePair>) => {
      let { name, value } = action.payload;
    },
    setSelectedPool: (state, action) => {
      state.selectedPool = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWeb3.fulfilled, (state, action: PayloadAction<Web3>) => {
      state.web3 = action.payload;
    });

    builder.addCase(
      getContract.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;
        if (name.includes("LPFarm")) {
          state.LPFarms!.push({
            name: name,
            contract: value[0],
            address: value[1],
            totalSupply: 0,
            currentCount: 0,
            isLoading: false,
          });
        } else if (name === RewardTokenName) {
          state.RewardToken!.contract = value[0];
          state.RewardToken!.address = value[1];
        }
      }
    );

    builder.addCase(
      getContractTotalSupply.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        if (name.includes("LPFarm")) {
          const _lpfarm = state.LPFarms?.filter((x) => x.name === name)[0];
          _lpfarm!.totalSupply = Number(Web3.utils.fromWei(value[0], "ether"));
          _lpfarm!.isLoading = false;
        } else if (name === RewardTokenName) {
          state.RewardToken!.totalSupply = Number(
            Web3.utils.fromWei(value[0], "ether")
          );
          state.RewardToken!.isLoading = false;
        }
        console.log(action.payload);
      }
    );

    // builder.addCase(
    //   transferToken.fulfilled,
    //   (state, action: PayloadAction<KeyValuePair>) => {
    //     let { name, value } = action.payload;

    //     if (name.includes("LPFarm")) {
    //       const _lpfarm = state.LPFarms?.filter((x) => x.name === name)[0];
    //       _lpfarm!.totalSupply = Number(Web3.utils.fromWei(value[0], "ether"));
    //       _lpfarm!.currentCount = Number(Web3.utils.fromWei(value[1], "ether"));
    //       _lpfarm!.isLoading = false;
    //     } else if (name === RewardTokenName) {
    //       state.RewardToken!.totalSupply = Number(
    //         Web3.utils.fromWei(value[0], "ether")
    //       );
    //       state.RewardToken!.currentCount = Number(
    //         Web3.utils.fromWei(value[1], "ether")
    //       );
    //       state.RewardToken!.isLoading = false;
    //     }
    //   }
    // );

    /*will return: 
      {
        name: name,
        value: [_depositedAmt, _rewardTokensAmt],
      }
    */
    builder.addCase(
      participate.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        const _lpfarm = state.LPFarms?.filter((x) => x.name === name)[0];
        state.deposits = Number(Web3.utils.fromWei(value[0], "ether"));
        state.yield = Number(Web3.utils.fromWei(value[1], "ether"));
        _lpfarm!.isLoading = false;
      }
    );

    // builder.addCase(
    //   getAddressTokenCount.fulfilled,
    //   (state, action: PayloadAction<KeyValuePair>) => {
    //     let { name, value } = action.payload;

    //     if (name.includes("LPFarm")) {
    //       const _lpfarm = state.LPFarms?.filter((x) => x.name === name)[0];
    //       _lpfarm!.currentCount = Number(Web3.utils.fromWei(value[0], "ether"));
    //       _lpfarm!.isLoading = false;
    //     } else if (name === RewardTokenName) {
    //       state.RewardToken!.currentCount = Number(
    //         Web3.utils.fromWei(value[0], "ether")
    //       );
    //       state.RewardToken!.isLoading = false;
    //     }
    //   }
    // );

    builder.addCase(
      stakeToken.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        state.RewardToken!.currentCount = Number(
          Web3.utils.fromWei(value[0], "ether")
        );
      }
    );

    builder.addCase(
      withdraw.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        state.RewardToken!.currentCount = Number(
          Web3.utils.fromWei(value[0], "ether")
        );

        state.yield = Number(Web3.utils.fromWei(value[1], "ether"));
      }
    );

    builder.addCase(
      claimRewards.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        state.RewardToken!.currentCount = Number(
          Web3.utils.fromWei(value[0], "ether")
        );

        state.yield = Number(Web3.utils.fromWei(value[2], "ether"));
      }
    );

    builder.addCase(
      checkpoint.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        state.expectedYield = Number(Web3.utils.fromWei(value[0], "ether"));
      }
    );
  },
});

export const { setAccount, setIsLoading, setSelectedPool } =
  blockchainSlice.actions;

export default blockchainSlice.reducer;
