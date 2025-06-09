import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_URL = vars.get("ALCHEMY_URL");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  defaultNetwork: "holesky",
  solidity: "0.8.28",
  networks:{
    holesky:{
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};

export default config;
