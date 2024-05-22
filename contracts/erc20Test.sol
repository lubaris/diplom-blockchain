// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// imports
import "./ERC20.sol";
// libraries

contract ERC20EXte is ERC20{
    uint256 public cost;

    constructor(uint256 _cost, string memory name, string memory symbol) ERC20(name, symbol) {
        cost = _cost;
    }

    function Buy(address _to) external payable {
        _mint(_to, msg.value*cost);
    }
    
}