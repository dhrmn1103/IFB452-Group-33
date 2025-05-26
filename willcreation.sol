// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WillCreation {

    struct Will {
        uint id;
        address testator;
        address beneficiary;
        string beneficiaryNameHash;
        string assetInfoHash;
        string ageConditionHash;
        bool isRevoked;
    }

    mapping(address => Will[]) private willsByTestator;
    mapping(uint => address) private willIdToOwner;
    mapping(uint => bool) private willExists;  

    uint private nextWillId = 1;

    event WillCreated(uint indexed id, address indexed testator, address indexed beneficiary);
    event WillUpdated(uint indexed id, address indexed testator, address indexed beneficiary);
    event WillRevoked(uint indexed id, address indexed testator);

    /// @notice Create a new digital will
    function createWill(
        address _beneficiary,
        string memory _beneficiaryNameHash,
        string memory _assetInfoHash,
        string memory _ageConditionHash
    ) public {
        require(_beneficiary != address(0), "Invalid beneficiary address");

        Will memory newWill = Will({
            id: nextWillId,
            testator: msg.sender,
            beneficiary: _beneficiary,
            beneficiaryNameHash: _beneficiaryNameHash,
            assetInfoHash: _assetInfoHash,
            ageConditionHash: _ageConditionHash,
            isRevoked: false
        });

        willsByTestator[msg.sender].push(newWill);
        willIdToOwner[nextWillId] = msg.sender;
        willExists[nextWillId] = true; 

        emit WillCreated(nextWillId, msg.sender, _beneficiary);
        nextWillId++;
    }

    /// @notice Update a specific will
    function updateWill(
        uint _willId,
        address _newBeneficiary,
        string memory _newBeneficiaryNameHash,
        string memory _newAssetInfoHash,
        string memory _newAgeConditionHash
    ) public {
        require(willExists[_willId], "Will does not exist");
        require(willIdToOwner[_willId] == msg.sender, "Not the owner of this will");

        Will[] storage userWills = willsByTestator[msg.sender];
        for (uint i = 0; i < userWills.length; i++) {
            if (userWills[i].id == _willId) {
                require(!userWills[i].isRevoked, "Will already revoked");

                userWills[i].beneficiary = _newBeneficiary;
                userWills[i].beneficiaryNameHash = _newBeneficiaryNameHash;
                userWills[i].assetInfoHash = _newAssetInfoHash;
                userWills[i].ageConditionHash = _newAgeConditionHash;

                emit WillUpdated(_willId, msg.sender, _newBeneficiary);
                return;
            }
        }

        revert("Will not found");
    }

    /// @notice Revoke a specific will
    function revokeWill(uint _willId) public {
        require(willExists[_willId], "Will does not exist");
        require(willIdToOwner[_willId] == msg.sender, "Not the owner of this will");

        Will[] storage userWills = willsByTestator[msg.sender];
        for (uint i = 0; i < userWills.length; i++) {
            if (userWills[i].id == _willId) {
                require(!userWills[i].isRevoked, "Will already revoked");

                userWills[i].isRevoked = true;
                emit WillRevoked(_willId, msg.sender);
                return;
            }
        }

        revert("Will not found");
    }

    /// @notice Get all wills of the sender
    function getMyWills() public view returns (Will[] memory) {
        return willsByTestator[msg.sender];
    }

    /// @notice Get a specific will by ID
    function getWillById(uint _willId) public view returns (Will memory) {
        require(willExists[_willId], "Will does not exist");  
        address owner = willIdToOwner[_willId];
        Will[] memory userWills = willsByTestator[owner];

        for (uint i = 0; i < userWills.length; i++) {
            if (userWills[i].id == _willId) {
                return userWills[i];
            }
        }

        revert("Will not found");
    }
}
