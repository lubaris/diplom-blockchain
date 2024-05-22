// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./Ownable.sol";
import "./SafeERC20.sol";

interface IUniswapV2Swap {

    function factory() external pure returns(address);

    function getAmountsOut(uint256 amountOut, address[] memory path) external view returns(uint256[] memory);

    function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] memory path, address to, uint256 deadline) external returns (uint256[] memory);

}

interface IUniswapV2Factory {

    function getPair(address tokenA, address tokenB) external view returns (address pair);

}
interface IModule {
    function getAmountSwap(address _from, address _to, uint256 _amount) external view returns(uint256);
    
    function swap(address _from, address _to, uint256 _amount, uint256 _expectedAmount) external returns(uint256 receivedAmount);
}

contract UniswapV2SwapModule is   Ownable, IModule  {
    using SafeERC20 for IERC20;

    IUniswapV2Swap public router;
    IUniswapV2Factory public factory;

    constructor(address _router, address _factory)  {
        router = IUniswapV2Swap(_router);
        factory = IUniswapV2Factory(_factory);
    }
    
    function getAmountSwap(address _from, address _to, uint256 _amount) external override view returns(uint256) {
        if(factory.getPair(_from, _to) == address(0)) {
            return 0;
        }
        address[] memory path = new address[](2);
        path[0] = _from;
        path[1] = _to;

        uint256[] memory receviedAmount = router.getAmountsOut(_amount, path);

        return receviedAmount[receviedAmount.length-1];
    }

    function swap(address _from, address _to, uint256 _amount, uint256 _expectedAmount) external override returns(uint256){
        address[] memory path = new address[](2);
        path[0] = _from;
        path[1] = _to;
        
        IERC20(_from).safeTransferFrom(msg.sender, address(this), _amount);
        if (IERC20(_from).allowance(address(this), address(router)) < _amount) {
            IERC20(_from).safeIncreaseAllowance(address(router), type(uint256).max);
        }

        uint256[] memory receviedAmount = router.swapExactTokensForTokens(_amount, _expectedAmount, path, msg.sender, block.timestamp);
        return receviedAmount[receviedAmount.length-1];
    }


}