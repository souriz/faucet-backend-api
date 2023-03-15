pragma solidity ^0.8.0;

contract Faucet {
    address public owner;
    uint256 public faucetAmount;
    uint256 public minTimeBetweenRequests;
    mapping (address => uint256) public lastRequestTimes;
    mapping (address => bool) public paidAddresses;
    bool private locked;

    constructor(uint256 _faucetAmount, uint256 _minTimeBetweenRequests) {
        owner = msg.sender;
        faucetAmount = _faucetAmount;
        minTimeBetweenRequests = _minTimeBetweenRequests;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    modifier lock() {
        require(!locked, "Reentrancy guard failed");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyIfRequestTimeDone(address _recipient) {
        require(block.timestamp - lastRequestTimes[_recipient] >= minTimeBetweenRequests, "Min time between requests has not elapsed");
        if (paidAddresses[_recipient]) {
            paidAddresses[_recipient] = false;
        }
        _;
    }

    function setFaucetAmount(uint256 _newAmount) public onlyOwner {
        faucetAmount = _newAmount;
    }

    function setMinTimeBetweenRequests(uint256 _newTime) public onlyOwner {
        minTimeBetweenRequests = _newTime;
    }

    function requestFaucet(address payable _recipient) public onlyOwner lock onlyIfRequestTimeDone(_recipient) {
        _recipient.transfer(faucetAmount);
        paidAddresses[_recipient] = true;
        lastRequestTimes[_recipient] = block.timestamp;
    }

    function markAddressAsPaid(address _address) public onlyOwner {
        paidAddresses[_address] = true;
    }

    function unmarkAddressAsPaid(address _address) public onlyOwner {
        paidAddresses[_address] = false;
    }

    function withdraw(uint256 _amount) public onlyOwner lock {
        require(_amount <= address(this).balance, "Insufficient funds");
        payable(owner).transfer(_amount);
    }


    function timeLeftUntilNextRequest(address _recipient) public view returns (uint256) {
        uint256 timeSinceLastRequest = block.timestamp - lastRequestTimes[_recipient];
        if (timeSinceLastRequest >= minTimeBetweenRequests) {
            return 0;
        } else {
            return minTimeBetweenRequests - timeSinceLastRequest;
        }
    }

    receive() external payable {}
}
