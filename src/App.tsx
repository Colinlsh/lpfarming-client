import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import MainLayout from "./components/MainLayout";
import { RootState } from "./redux/store";
import { getContract, getWeb3 } from "./redux/slice/blockchainSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  getContractModel,
  LPFactoryName,
  RewardTokenName,
} from "./model/blockchain/blockchainModel";
import Footer from "./components/Footer";

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
      handleGetContract(LPFactoryName);
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
    <div className="bg-zinc-200">
      <Navbar />
      <MainLayout />
      <Footer />
    </div>
  );
}

export default App;
