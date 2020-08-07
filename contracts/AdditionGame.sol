pragma solidity ^0.4.24;

// need to change

contract AdditionGame {
    
    // need to add
    struct Host{
        string name;
        string id_number;
        string phone;
    }

    struct Record{
        address addr;
    }

    mapping(address => bool) public join;      // 굳이?
    mapping(address => Host) public hosts;     // 개수 관리 필요함?
    mapping(address => Record) records;         // 주소는 필요할수도? >> 기록 관리 어떻게 할지 한번 확인 //TODO
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
    
    function setHost(string name, string id_number, string phone) external {
        hosts[owner] = Host(name, id_number, phone);
    }

    function getHost(address addr) public view returns (string name, string id_number, string phone) {
        name = hosts[addr].name;
        id_number = hosts[addr].id_number;
        phone = hosts[addr].phone;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function deposit() public payable {  
        require(msg.sender == owner);
    }   
  
    function transfer(uint _value) public returns (bool) {
        require(getBalance() >= _value);
        msg.sender.transfer(_value);
        return true;
    }
}
