// This script can be used to deploy the "Storage" contract using ethers.js library.
// Please make sure to compile "./contracts/1_Storage.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

import { deploy, attach } from './ethers-lib'
import { ethers } from 'ethers';
(async () => {
    try {

        const router = await deploy('SwapRouter', [])
        const swapModule1 = await deploy('UniswapV2SwapModule', ["0x10ED43C718714eb63d5aA57B78B54704E256024E", "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"]);
        const swapModule2 = await deploy('UniswapV2SwapModule', ["0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7", "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6"]);
        const token1 = await deploy("ERC20EXte", [1, "KrendelCoin", "KRENDEL"]);
        const token2 = await deploy("ERC20EXte", [2, "GerdaCoin", "GERDA"]);
        const weth = await attach("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");


        router.addModuleSwap(swapModule1.address, "pancake");
        router.addModuleSwap(swapModule2.address, "thena");
        router.addToken(token1.address);
        router.addToken(token2.address);
        //0x093E8F0e110C147EAc53857d01A664CB4740fcCD - user
        weth.approve(router.address, ethers.constants.MaxUint256);
        //weth.approve(router.address, ethers.constants.MaxUint256, {from: "0x093E8F0e110C147EAc53857d01A664CB4740fcCD"});
        //0x7001dB053c658dd491897810F0C137c1fF56A19F - router
        //0xf4c91084463784c4829900802d8F501e5bE7f32b - module1
        //0xf5D3D86D486403D4813A335ED20B537a229BC1d8 - module2
        //0xB37a689a127f6b9C93b6838501D54927589791f1 - token1
        //0xc32298079da6E05AA771aC375975E80908fe53ed -token2
        console.log(`address router: ${router.address}`)
        console.log(`address swapModule: ${swapModule1.address}`)
        console.log(`address swapModule: ${swapModule2.address}`)
        console.log(`address token1: ${token1.address}`)
        console.log(`address token2: ${token2.address}`)
        console.log(weth.balanceOf("0x404F05BBB422D147a678E6Fa241587aB8F62C974"));
    } catch (e) {
        console.log(e.message)
    }
  })()