import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  checkpoint,
  claimRewards,
  getFarmStats,
  setSelectedPool,
  withdraw,
} from "../redux/slice/blockchainSlice";
import { RootState } from "../redux/store";
import LPFarm from "./LPFarm";

const Tabbar = () => {
  // #region redux
  const state = useAppSelector((state: RootState) => state.blockchain);
  const dispatch = useAppDispatch();
  // #endregion
  const [farmAddress, setFarmAddress] = useState("");

  const handleSelectOptionAddress = (address: string) => {
    setFarmAddress(address);
    setSelectedPoolDispatch(address);
  };

  const setSelectedPoolDispatch = (address: string) => {
    const _farm = state.LPFarms?.filter((x) => x.address === address)[0];
    dispatch(setSelectedPool(_farm?.name));
  };

  const handleCheckpoint = () => {
    dispatch(
      checkpoint({
        contracts: [state.LPFarms!.filter((x) => x.address === farmAddress)[0]],
        contractName: state.selectedPool,
        from: state.currentAccount,
        to: "",
        value: 0,
        web3: state.web3,
      })
    );
  };

  const handleClaimReward = () => {
    dispatch(
      claimRewards({
        contracts: [
          state.LPFarms!.filter((x) => x.address === farmAddress)[0],
          state.RewardToken!,
        ],
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
        contracts: [
          state.LPFarms!.filter((x) => x.address === farmAddress)[0],
          state.RewardToken!,
        ],
        contractName: state.selectedPool,
        from: state.currentAccount,
        to: "",
        value: 0,
        web3: state.web3,
      })
    );
  };

  useEffect(() => {
    if (
      state.LPFarms !== undefined &&
      state.LPFarms.length > 0 &&
      farmAddress === ""
    ) {
      setFarmAddress(state.LPFarms![0].address);
    }
  }, [state.LPFarms]);

  useEffect(() => {
    dispatch(
      getFarmStats({
        contracts: [
          state.LPFarms!.filter((x) => x.address === farmAddress)[0]!,
        ],
        contractName: state.selectedPool,
        from: state.currentAccount,
        to: "",
        value: 0,
        web3: state.web3,
      })
    );
  }, [
    state.totalClaimedReward,
    farmAddress,
    state.selectedPool,
    state.currentAccount,
    state.LPFarms,
  ]);

  return (
    <div className="rounded border border-black drop-shadow-xl">
      <div className="sm:hidden relative mx-auto bg-white dark:bg-gray-800">
        <div className="absolute inset-0 m-auto mr-4 z-0 w-6 h-6">
          <img
            className="icon icon-tabler icon-tabler-selector"
            src="https://tuk-cdn.s3.amazonaws.com/can-uploader/tabs-with-icons-svg1.svg"
            alt="selectors"
          />
        </div>
        <select
          aria-label="Selected tab"
          className="dark:text-white form-select block w-full p-3 border border-gray-300 rounded text-gray-600 appearance-none bg-transparent relative z-10"
          onChange={(e) => handleSelectOptionAddress(e.target.value)}
          value={farmAddress}
        >
          {state.LPFarms!.map((x, index) => (
            <option
              key={x.address}
              className={
                farmAddress === x.address
                  ? "text-sm text-gray-600 selected"
                  : "text-sm text-gray-600"
              }
              value={x.address}
            >
              {x.name}
            </option>
          ))}
        </select>
      </div>
      <div className="xl:w-full xl:mx-0 h-12 hidden sm:block bg-white dark:bg-gray-800 shadow">
        <div className="flex h-full place-content-around px-10">
          {state.LPFarms!.map((x, index) => (
            <button
              key={index}
              onClick={() => handleSelectOptionAddress(`${x.address}`)}
              className={
                farmAddress === x.address
                  ? "bg-gray-600 border-0 hover:bg-gray-600 hover:text-white font-bold"
                  : "h-full bg-transparent border-0 font-bold"
              }
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>
      <LPFarm
        LPFarm={state.LPFarms!.filter((x) => x.address === farmAddress)[0]!}
        handleCheckPoint={handleCheckpoint}
        handleClaimReward={handleClaimReward}
        handleWithdraw={handleWithdraw}
        isParticipant={
          state.LPFarms!.filter((x) => x.address === farmAddress)[0] ===
          undefined
            ? false
            : state.LPFarms!.filter((x) => x.address === farmAddress)[0]!
                .isParticipant
        }
      />
      <div className="grid grid-cols-2">
        <div className="grid grid-rows-2 flex justify-items-end mt-2">
          <p>{"total claimed reward: "}</p>
          <p>{" current block number: "}</p>
        </div>
        <div className="grid grid-rows-2 flex justify-center mt-2">
          <p>{state.totalClaimedReward}</p>
          <p>{state.currentBlockNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default Tabbar;
