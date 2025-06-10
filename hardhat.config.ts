import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_URL_HOLESKY = vars.get("ALCHEMY_URL_HOLESKY");
const ALCHEMY_URL_SEPOLIA = vars.get("ALCHEMY_URL_SEPOLIA");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  solidity: "0.8.28",
  networks:{
    holesky:{
      url: ALCHEMY_URL_HOLESKY,
      accounts: [PRIVATE_KEY]
    },
    sepolia:{
      url:ALCHEMY_URL_SEPOLIA,
      accounts: [PRIVATE_KEY]
    }
  }
};

export default config;
