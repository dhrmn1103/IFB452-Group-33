// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWillCreation {
    struct Will {
        uint id;
        address testator;
        address beneficiary;
        string beneficiaryNameHash;
        string assetInfoHash;
        string ageConditionHash;
        bool isRevoked;
    }

    function getWillById(uint _willId) external view returns (Will memory);
}

contract ValidateAndExecuteWill {
    IWillCreation public willContract;

    mapping(uint => bool) public isVerified;
    mapping(uint => bool) public executed;

    event DeathCertificateSubmitted(uint indexed willId, address indexed authority);
    event WillExecuted(uint indexed willId, address indexed beneficiary);

    constructor(address _willAddress) {
        willContract = IWillCreation(_willAddress);
    }

    function submitDeathCertificate(uint willId, string memory fakeHash) external {
        IWillCreation.Will memory will = willContract.getWillById(willId);
        require(will.testator != address(0), "Will does not exist");
        require(!will.isRevoked, "Will is revoked");
        require(!isVerified[willId], "Already verified");

        isVerified[willId] = true;
        emit DeathCertificateSubmitted(willId, msg.sender);
    }

    function executeWill(uint willId) external {
        IWillCreation.Will memory will = willContract.getWillById(willId);
        require(will.testator != address(0), "Will does not exist");
        require(!will.isRevoked, "Will is revoked");
        require(isVerified[willId], "Not verified");
        require(!executed[willId], "Already executed");

        executed[willId] = true;
        emit WillExecuted(willId, will.beneficiary);
    }
}
