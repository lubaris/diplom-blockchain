import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const SwapModule = buildModule("SwapModule", (m) => {

  const UniswapV2SwapModule1 = m.contract("UniswapV2SwapModule", ["0x10ED43C718714eb63d5aA57B78B54704E256024E", "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"], {id: "SwapModule1"});
  const UniswapV2SwapModule2 = m.contract("UniswapV2SwapModule", ["0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7", "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6"], {id: "SwapModule2"});
  
  const router = m.contract("SwapRouter", []);
  const token1 = m.contract("ERC20EXte", [1, "KrendelCoin", "KRENDEL"]);
  const token2 = m.contract("ERC20EXte", [2, "GerdaCoin", "GERDA"], {id: "ERC20EXte#token1"});
  //0x7001dB053c658dd491897810F0C137c1fF56A19F
  //0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c
  //0x55d398326f99059ff775485246999027b3197955
  m.call(router, "addModuleSwap", [UniswapV2SwapModule1, "pancake"]);
  m.call(router, "addModuleSwap", [UniswapV2SwapModule2, "pancake"]);
  m.call(router, 'addToken', [token1]);
  m.call(router, 'addToken', [token2]);


  return { router, UniswapV2SwapModule1, UniswapV2SwapModule2, token1, token2};
});

export default SwapModule;
