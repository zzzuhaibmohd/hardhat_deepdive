// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

contract Token {
    address private owner; // slot 0

    string public constant name = "HAHA"; // constant variables do not have a slot.

    uint256 private totalSupply; //storage slot 1.

    mapping(address => uint256) private balances;

    constructor(uint256 _totalSupply) {
        console.log(
            "Deploying the contract!, with a totalSupply of -->",
            _totalSupply
        );
        owner = msg.sender;
        totalSupply = _totalSupply;
        balances[owner] += totalSupply; //mint and transfer the initial totalSupply to owner
    }

    function transfer(uint256 _amount, address _to) external {
        require(balances[msg.sender] >= _amount, "Not enough funds");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function balanceOf(address _address)
        external
        view
        returns (uint256 result)
    {
        result = balances[_address];
    }

    function getTotalSupply() external view returns (uint256 _totalSupply) {
        _totalSupply = totalSupply;
    }
}