// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionLogger {
    event TransactionRecorded(address indexed sender, address indexed receiver, uint256 amount, string txHash);

    function recordTransaction(address receiver, uint256 amount, string memory txHash) public {
        emit TransactionRecorded(msg.sender, receiver, amount, txHash);
    }
}
