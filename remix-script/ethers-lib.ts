import { ethers } from 'ethers'

/**
 * Deploy the given contract
 * @param {string} contractName name of the contract to deploy
 * @param {Array<any>} args list of constructor' parameters
 * @param {Number} accountIndex account index from the exposed account
 * @return {Contract} deployed contract
 */
const WETH_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]
export const deploy = async (contractName: string, args: Array<any>, accountIndex?: number): Promise<ethers.Contract> => {    

  console.log(`deploying ${contractName}`)
  // Note that the script needs the ABI which is generated from the compilation artifact.
  // Make sure contract is compiled and artifacts are generated
  const artifactsPath = `browser/contracts/contracts/artifacts/${contractName}.json` // Change this for different path

  const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
  // 'web3Provider' is a remix global variable object
    
  const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner(accountIndex)

  const factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)

  const contract = await factory.deploy(...args)   

  // The contract is NOT deployed yet; we must wait until it is mined
  await contract.deployed()
  return contract
}

export const attach = async(contractAddress: string, accountIndex?: number): Promise<ethers.Contract> => {

  // 'web3Provider' is a remix global variable object
    
  const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner(accountIndex)



  const contract = new ethers.Contract(contractAddress, WETH_ABI,signer);

  contract.deposit({ value: ethers.utils.parseEther("1000.0")});

  // The contract is NOT deployed yet; we must wait until it is mined
  return contract

}