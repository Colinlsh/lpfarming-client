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
  RewardTokenName,
  KeyValuePair,
  LPFactoryName,
  LPFarmModel,
  CreateLPFarmModel,
  FarmDetails,
} from "../../model/blockchain/blockchainModel";

import LPFactory from "../../blockchain/build/LPFactory.json";
import LPFarm from "../../blockchain/build/LPFarm.json";
import RewardToken from "../../blockchain/build/RewardToken.json";
import { AbiItem } from "web3-utils";

const contractObject = [
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
  // dev
  // const _web3 = new Web3(
  //   Web3.givenProvider ||
  //     new Web3.providers.WebsocketProvider(process.env.REACT_APP_LOCAL_GANACHE!)
  // );

  const _web3 = new Web3(
    Web3.givenProvider ||
      new Web3.providers.WebsocketProvider(process.env.REACT_APP_ROPSTEN!)
  );

  return _web3;
});

export const getLPFarms = createAsyncThunk(
  "blockchain/getLPFarms",
  async (transactionModel: transactionModel) => {
    const lpFactory = transactionModel.contracts[0]!.contract!;
    // dev
    let farms: FarmDetails[] = [];
    try {
      const farmsAddress = await lpFactory.methods
        .getLPFarms()
        .call({ from: transactionModel.from });

      // create and get all contracts
      for (let index = 0; index < farmsAddress.length; index++) {
        const _contract = new transactionModel.web3!.eth.Contract(
          LPFarm.abi as any,
          farmsAddress[index]
        );

        const rewardProportion = await _contract.methods
          .rewardProportion()
          .call();

        farms.push({
          address: farmsAddress[index],
          contract: _contract,
          rewardProportion: rewardProportion,
        } as FarmDetails);
      }
    } catch (error) {
      console.log(error);
    }

    return {
      name: "farms",
      value: [farms],
    } as KeyValuePair;
  }
);

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
    }

    const blockNumber = await web3!.eth.getBlockNumber();

    return {
      name: contractName,
      value: [_contract, address, blockNumber],
    } as KeyValuePair;
  }
);

export const getRewardTokenBalance = createAsyncThunk(
  "blockchain/getRewardTokenBalance",
  async (transactionModel: transactionModel) => {
    const rewardTokenContract = transactionModel.contracts[0]!.contract!;

    let _rewards = await rewardTokenContract.methods
      .balanceOf(transactionModel.from)
      .call();

    return {
      name: transactionModel.contracts[0]!.address,
      value: [_rewards],
    } as KeyValuePair;
  }
);

export const participate = createAsyncThunk(
  "blockchain/participate",
  async (transactionModel: transactionModel) => {
    try {
      const _lpContract = transactionModel.contracts[0].contract!;
      const rewardTokenContract = transactionModel!.contracts[1].contract!;

      await _lpContract.methods.participate().send({
        from: transactionModel.from,
        value: Web3.utils.toWei(transactionModel.value, "ether"),
      });

      let _depositedAmt = await _lpContract.methods
        .deposits(transactionModel.from)
        .call();

      const blockNumber = await transactionModel.web3!.eth.getBlockNumber();

      const claimedReward = await rewardTokenContract.methods
        .balanceOf(transactionModel.from)
        .call();

      return {
        name: transactionModel.contracts[0].address,
        value: [_depositedAmt, blockNumber, claimedReward],
      } as KeyValuePair;
    } catch (error) {
      console.log(error);
      if ((error as any).code === 4001) {
      }
    }

    return {
      name: transactionModel.contracts[0].address,
      value: [-1, -1],
    } as KeyValuePair;
  }
);

export const withdraw = createAsyncThunk(
  "blockchain/withdraw",
  async (transactionModel: transactionModel) => {
    try {
      let contract = transactionModel!.contracts[0].contract!;
      let rewardTokenContract = transactionModel!.contracts[1].contract!;

      await contract.methods.withdraw().send({
        from: transactionModel.from,
      });

      let claimedReward = await rewardTokenContract.methods
        .balanceOf(transactionModel.from)
        .call();

      return {
        name: transactionModel!.contracts[0].address,
        value: [claimedReward, transactionModel!.contracts[0]],
      } as KeyValuePair;
    } catch (error) {
      console.log(error);
    }
    return {
      name: transactionModel!.contracts[0].address,
      value: [-1, transactionModel!.contracts[0]],
    } as KeyValuePair;
  }
);

export const claimRewards = createAsyncThunk(
  "blockchain/claimRewards",
  async (transactionModel: transactionModel) => {
    try {
      let contract = transactionModel.contracts[0].contract!;
      let rewardTokenContract = transactionModel.contracts[1].contract!;

      await contract.methods.claimRewards().send({
        from: transactionModel.from,
      });

      let claimedReward = await rewardTokenContract.methods
        .balanceOf(transactionModel.from)
        .call();

      return {
        name: transactionModel.contracts[0]!.name,
        value: [claimedReward, transactionModel.contracts[0]!.address],
      } as KeyValuePair;
    } catch (error) {
      console.log(error);
    }
    return {
      name: "",
      value: [-1, transactionModel.contracts[0]!.address],
    } as KeyValuePair;
  }
);

export const getFarmStats = createAsyncThunk(
  "blockchain/getFarmStats",
  async (transactionModel: transactionModel) => {
    const contract = transactionModel.contracts[0].contract!;

    const rewardProportion = await contract.methods.rewardProportion().call();

    const blockNumber = await transactionModel.web3!.eth.getBlockNumber();

    const startBlockNumber = await contract.methods
      .startBlockNumber(transactionModel.from)
      .call();

    const isParticipant = await contract.methods
      .isParticipant(transactionModel.from)
      .call();

    if (!isParticipant) {
      const zeroWei = Web3.utils.toWei("0", "ether");
      return {
        name: transactionModel.contracts[0].address,
        value: [
          rewardProportion,
          zeroWei,
          zeroWei,
          zeroWei,
          blockNumber,
          isParticipant,
          0,
        ],
      } as KeyValuePair;
    }
    const deposit = await contract.methods
      .deposits(transactionModel.from)
      .call();

    const claimedRewards = await contract.methods
      .claimedRewards(transactionModel.from)
      .call();

    const expectedYield = await contract.methods
      .checkpoint()
      .call({ from: transactionModel.from });

    return {
      name: transactionModel.contracts[0].address,
      value: [
        rewardProportion,
        deposit,
        claimedRewards,
        expectedYield,
        blockNumber,
        isParticipant,
        startBlockNumber,
      ],
    } as KeyValuePair;
  }
);

export const checkpoint = createAsyncThunk(
  "blockchain/checkpoint",
  async (transactionModel: transactionModel) => {
    const expectedYield = await transactionModel.contracts[0]
      .contract!.methods.checkpoint()
      .call({ from: transactionModel.from });

    const blockNumber = await transactionModel.web3!.eth.getBlockNumber();

    return {
      name: transactionModel.contracts[0].address,
      value: [expectedYield, blockNumber],
    } as KeyValuePair;
  }
);

export const createLPFarm = createAsyncThunk(
  "blockchain/createLPFarm",
  async (createLPFarmModel: CreateLPFarmModel) => {
    try {
      const lpFactory = createLPFarmModel.contracts[0].contract!;
      const web3 = createLPFarmModel.web3!;

      const newLPaddress = await lpFactory.methods
        .createLPFarm(
          createLPFarmModel.tokenAddress,
          createLPFarmModel.rewardProportion
        )
        .send({ from: createLPFarmModel.from });

      // const address = newLPaddress.events.address;
      console.log(newLPaddress);

      let _lpAddress = await lpFactory.methods
        .getLPFarmsAddress(
          createLPFarmModel.tokenAddress,
          createLPFarmModel.rewardProportion
        )
        .call();

      const _contract = new web3.eth.Contract(LPFarm.abi as any, _lpAddress);

      return {
        name: newLPaddress,
        value: [_contract, _lpAddress, createLPFarmModel.rewardProportion],
      } as KeyValuePair;
    } catch (error) {
      console.log(error);
    }

    return {
      name: "",
      value: [-1],
    } as KeyValuePair;
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
    LPFarms: [] as LPFarmModel[],
    LPFactory: {
      name: LPFactoryName,
      contract: undefined,
      totalSupply: 0,
      isLoading: false,
      currentCount: 0,
    },
    RewardToken: {
      name: RewardTokenName,
      contract: undefined,
      totalSupply: 0,
      isLoading: false,
      currentCount: 0,
    },
    totalClaimedReward: "0",
    selectedPool: "-",
    currentBlockNumber: 0,
  } as web3State,
  reducers: {
    setAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<KeyValuePair>) => {
      let { name, value } = action.payload;

      const _lpfarm = state.LPFarms!.filter((x) => x.address === name)[0];

      if (_lpfarm !== undefined) {
        _lpfarm.isLoading = value[0];
      }
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
          const _farm = state.LPFarms!.filter((x) => x.address === value[1])[0];

          if (_farm === undefined) {
            state.LPFarms!.push({
              name: name,
              contract: value[0],
              address: value[1],
              totalSupply: 0,
              currentCount: 0,
              isLoading: false,
              claimedRewards: 0,
              expectedYield: 0,
              rewardProportion: 0,
              deposits: "0",
              isParticipant: false,
              startBlockNumber: "0",
              isWithdrawing: false,
              isClaimingRewards: false,
            });
          }
        } else if (name === RewardTokenName) {
          state.RewardToken!.contract = value[0];
          state.RewardToken!.address = value[1];
        } else if (name === LPFactoryName) {
          state.LPFactory!.contract = value[0];
          state.LPFactory!.address = value[1];
        }
        state.selectedPool =
          state.LPFarms!.length > 0 ? state.LPFarms![0].name : "-";

        state.currentBlockNumber = value[3];
      }
    );

    builder.addCase(
      getRewardTokenBalance.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        state.totalClaimedReward = Web3.utils.fromWei(value[0], "ether");
      }
    );

    builder.addCase(
      participate.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        const _lpfarm = state.LPFarms!.filter((x) => x.address === name)[0];

        if (value[0] !== -1 && value[1] !== -1) {
          _lpfarm.deposits = Web3.utils.fromWei(value[0], "ether");

          state.currentBlockNumber = value[1];
          state.totalClaimedReward = Web3.utils.fromWei(value[2], "ether");
        }

        _lpfarm.isLoading = false;
      }
    );

    builder.addCase(participate.pending, (state, { meta }) => {
      let transactionModel = meta.arg as transactionModel;

      const _lpfarm = state.LPFarms!.filter(
        (x) => x.address === transactionModel.contracts[0]!.address
      )[0];

      if (_lpfarm !== undefined) {
        _lpfarm.isLoading = true;
      }
    });

    builder.addCase(participate.rejected, (state, { meta }) => {
      let transactionModel = meta.arg as transactionModel;

      const _lpfarm = state.LPFarms!.filter(
        (x) => x.address === transactionModel.contracts[0]!.address
      )[0];

      if (_lpfarm !== undefined) {
        _lpfarm.isLoading = false;
      }
    });

    builder.addCase(withdraw.pending, (state, { meta }) => {
      const transactionModel = meta.arg as transactionModel;

      const _lpfarm = state.LPFarms?.filter(
        (x) => x.address === transactionModel.contracts[0]!.address
      )[0];

      _lpfarm!.isWithdrawing = true;
    });

    builder.addCase(
      withdraw.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;
        const _farm = value[1] as LPFarmModel;

        const _lpfarm = state.LPFarms!.filter(
          (x) => x.address === _farm!.address
        )[0];

        if (value[0] !== -1) {
          _lpfarm.claimedRewards = 0;
          _lpfarm.expectedYield = 0;
          _lpfarm.deposits = "0";

          state.totalClaimedReward = Web3.utils.fromWei(value[0], "ether");
        }

        _lpfarm.isWithdrawing = false;
      }
    );

    builder.addCase(withdraw.rejected, (state, { meta }) => {
      const transactionModel = meta.arg as transactionModel;

      const _lpfarm = state.LPFarms?.filter(
        (x) => x.address === transactionModel.contracts[0]!.address
      )[0];

      _lpfarm!.isWithdrawing = false;
    });

    builder.addCase(claimRewards.pending, (state, { meta }) => {
      const transactionModel = meta.arg as transactionModel;
      const _lpfarm = state.LPFarms!.filter(
        (x) => x.address === transactionModel.contracts[0]!.address
      )[0];
      _lpfarm.isClaimingRewards = true;
    });

    builder.addCase(
      claimRewards.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        const _lpfarm = state.LPFarms!.filter((x) => x.address === value[1])[0];

        if (value[0] !== -1) {
          state.totalClaimedReward = Web3.utils.fromWei(value[0], "ether");
        }
        _lpfarm.isClaimingRewards = false;
      }
    );

    builder.addCase(claimRewards.rejected, (state, { meta }) => {
      const transactionModel = meta.arg as transactionModel;
      const _lpfarm = state.LPFarms!.filter(
        (x) => x.address === transactionModel.contracts[0]!.address
      )[0];
      _lpfarm.isClaimingRewards = false;
    });

    builder.addCase(
      checkpoint.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;
        const _lpfarm = state.LPFarms?.filter((x) => x.address === name)[0]!;
        _lpfarm.expectedYield = Number(Web3.utils.fromWei(value[0], "ether"));

        state.currentBlockNumber = value[1];
      }
    );

    builder.addCase(
      getFarmStats.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        const _farm = state.LPFarms?.filter((x) => x.address === name)[0]!;

        _farm.rewardProportion = value[0];
        _farm.deposits = Web3.utils.fromWei(value[1], "ether");
        _farm.claimedRewards = Number(Web3.utils.fromWei(value[2], "ether"));
        _farm.expectedYield = Number(Web3.utils.fromWei(value[3], "ether"));
        _farm.isParticipant = value[5];
        _farm.startBlockNumber = value[6];

        state.currentBlockNumber = value[4];
      }
    );

    builder.addCase(createLPFarm.pending, (state, { meta }) => {
      state.LPFactory!.isCreatingFarm = true;
    });

    builder.addCase(
      createLPFarm.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        if (value[0] !== -1) {
          const _lpfarm = state.LPFarms?.filter((x) => x.address === name)[1]!;

          if (_lpfarm === undefined) {
            state.LPFarms?.push({
              name: "LPFarm" + value[2],
              contract: value[0],
              address: value[1],
              totalSupply: 0,
              currentCount: 0,
              isLoading: false,
              claimedRewards: 0,
              expectedYield: 0,
              rewardProportion: 0,
              deposits: "0",
              isParticipant: false,
              startBlockNumber: "0",
              isWithdrawing: false,
              isClaimingRewards: false,
            });
          }
        }
        state.LPFactory!.isCreatingFarm = false;
      }
    );

    builder.addCase(createLPFarm.rejected, (state, { meta }) => {
      state.LPFactory!.isCreatingFarm = false;
    });

    builder.addCase(
      getLPFarms.fulfilled,
      (state, action: PayloadAction<KeyValuePair>) => {
        let { name, value } = action.payload;

        let farms: FarmDetails[] = value[0];

        for (let index = 0; index < farms.length; index++) {
          const _lpfarm = farms[index];

          const farm = state.LPFarms?.filter(
            (x) => x.address === _lpfarm.address
          )[0]!;

          if (farm === undefined) {
            state.LPFarms?.push({
              name: "LPFarm" + farms[index].rewardProportion,
              contract: farms[index].contract,
              address: farms[index].address,
              totalSupply: 0,
              currentCount: 0,
              isLoading: false,
              claimedRewards: 0,
              expectedYield: 0,
              rewardProportion: 0,
              deposits: "0",
              isParticipant: false,
              startBlockNumber: "0",
              isWithdrawing: false,
              isClaimingRewards: false,
            });
          }
        }
      }
    );
  },
});

export const { setAccount, setIsLoading, setSelectedPool } =
  blockchainSlice.actions;

export default blockchainSlice.reducer;
