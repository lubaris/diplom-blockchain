// // This script can be used to deploy the "Storage" contract using ethers.js library.
// // Please make sure to compile "./contracts/1_Storage.sol" file before running this script.
// // And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

// import { deploy } from './ethers-lib'

// (async () => {
//     try {
//         const router = await deploy('SwapRouter', [])
//         const swapModule1 = await deploy('UniswapV2SwapModule', ["0x10ED43C718714eb63d5aA57B78B54704E256024E", "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"]);
//         const swapModule2 = await deploy('UniswapV2SwapModule', ["0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7", "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6"]);
//         const token1 = await deploy("ERC20EXte", [1, "KrendelCoin", "KRENDEL"]);
//         const token2 = await deploy("ERC20EXte", [2, "GerdaCoin", "GERDA"]);

//         router.addModuleSwap(swapModule1.address, "pancake");
//         router.addModuleSwap(swapModule2.address, "thena");
//         router.addToken(token1.address);
//         router.addToken(token2.address);

//         console.log(`address router: ${router.address}`)
//         console.log(`address swapModule: ${swapModule1.address}`)
//         console.log(`address swapModule: ${swapModule2.address}`)
//         console.log(`address swapModule: ${token1.address}`)
//         console.log(`address swapModule: ${token2.address}`)
//     } catch (e) {
//         console.log(e.message)
//     }
//   })()