// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeriveModule = buildModule("DeriveModule", (m) => {
  
  const derive = m.contract("Derive");

  return { derive };
});

export default DeriveModule;
