import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const LockModule = buildModule("LockModule", (m) => {
  const router = m.contract("SwapRouter", []);

  m.call(router, "addModuleSwap", []);

  return { router };
});

export default LockModule;
