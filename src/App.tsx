import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import MainLayout from "./components/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getContract, getWeb3 } from "./redux/slice/blockchainSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  getContractModel,
  LPFarmName20,
  LPFarmName30,
  LPFarmName50,
  RewardTokenName,
} from "./model/blockchain/blockchainModel";

function App() {
  // #region Redux
  var dispatch = useAppDispatch();
  const state = useAppSelector((state: RootState) => state.blockchain);
  // #endregion

  const init = () => {
    dispatch(getWeb3());
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (state.web3 !== undefined) {
      handleGetContract(RewardTokenName);
      handleGetContract(LPFarmName50);
      handleGetContract(LPFarmName30);
      handleGetContract(LPFarmName20);
    }
  }, [state.web3]);

  const handleGetContract = (contractName: string) => {
    dispatch(
      getContract({
        web3: state.web3!,
        contractName: contractName,
      } as getContractModel)
    );
  };
  return (
    <>
      <Navbar />
      <MainLayout />
    </>
  );
}

export default App;
