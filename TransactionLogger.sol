// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract AvaxWallet {
    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed receiver, uint256 amount);
    event TransactionRecorded(address indexed sender, address indexed receiver, uint256 amount);
    event AvaxSent(address indexed sender, address indexed receiver, uint256 amount);

    Transaction[] public transactions;

    // ✅ Deposit AVAX into the contract
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit Deposited(msg.sender, msg.value);
    }

    // ✅ Withdraw AVAX from the contract
    function withdraw(uint256 _amount) public {
        require(address(this).balance >= _amount, "Insufficient contract balance");
        payable(msg.sender).transfer(_amount);
        emit Withdrawn(msg.sender, _amount);
    }

    // ✅ Send AVAX from contract (within contract balance)
    function sendAvax(address payable _receiver, uint256 _amount) public {
        require(address(this).balance >= _amount, "Not enough funds in contract");

        _receiver.transfer(_amount);
        transactions.push(Transaction(msg.sender, _receiver, _amount, block.timestamp));

        emit AvaxSent(msg.sender, _receiver, _amount);
        emit TransactionRecorded(msg.sender, _receiver, _amount);
    }

    // ✅ Get all transactions stored in contract
    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    // ✅ Get contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
