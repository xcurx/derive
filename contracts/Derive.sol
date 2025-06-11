// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./ERC721.sol";

contract Derive is ERC721 {
    event Creation(address owner, uint tokenId, string name);
    event ResourceAdded(address owner, bytes32 resourceId, string name, uint tokenId, string dataToEncryptHash);
    event AccessAdded(bytes32 resourceId, uint tokenId);
    event KeyReclaimed(address prevOwner, uint tokenId);
    event RemovedFromList(bytes32 resourceId, uint tokenId);
    event ResourceRemoved(address owner, bytes32 resourceId);

    uint public counter;

    struct Key {
        uint tokenId;
        string name;
        address realOwner;
        address currentOwner;
    }

    struct Resource {
        string name;
        string cid;
        address owner;
        string dataToEncryptHash;
    }

    mapping(uint => Key) keys;
    mapping(bytes32 => Resource) resources;
    mapping(bytes32 => uint[]) access;

    modifier isOwner(uint tokenId) {
        require(keys[tokenId].realOwner == msg.sender, "NFT is not owned by you");
        _;
    }

    modifier resourceExist(bytes32 resourceId, bool alt) {
        if(alt) {
            require(resources[resourceId].owner != address(0), "Resource does not exists");
        } else {
            require(resources[resourceId].owner == address(0), "Resource already exists");
        }
        _;
    }

    modifier isResourceOwner(bytes32 resourceId) {
        require(resources[resourceId].owner == msg.sender, "Not a resource owner");
        _;
    }

    function createNFT(string memory _name) external {
        uint tokenId = counter++;
        _mint(msg.sender, tokenId);
        keys[tokenId] = Key({
            name: _name,
            tokenId: tokenId,
            realOwner: msg.sender,
            currentOwner: msg.sender
        });
        emit Creation(msg.sender, tokenId, _name);
    }

    function addResource(
        string memory _name, 
        string memory _cid, 
        uint tokenId, 
        string memory _dataToEncryptHash
    ) external isOwner(tokenId) {
        bytes32 resourceId = keccak256(abi.encode(_name, msg.sender));
        require(resources[resourceId].owner == address(0), "Resource already exists");
    
        resources[resourceId] = Resource({ 
            name: _name, 
            cid: _cid, 
            owner:msg.sender,
            dataToEncryptHash: _dataToEncryptHash
        });
        access[resourceId].push(tokenId);

        emit ResourceAdded(msg.sender, resourceId, _name, tokenId, _dataToEncryptHash);
    }

    function removeResource(bytes32 resourceId) external isResourceOwner(resourceId) {
        require(resources[resourceId].owner == address(0), "Resource already exists");
        
        delete resources[resourceId];
        emit ResourceRemoved(msg.sender, resourceId);
    }

    function hasAccess(address user, bytes32 resourceId) public view resourceExist(resourceId, true) returns (bool) {
        require(resources[resourceId].owner != address(0), "Resource does not exists");
        require(user != address(0), "Zero address");

        if(resources[resourceId].owner == user) {
            return true;
        }
        
        for (uint i = 0; i < access[resourceId].length; i++) {
            if(_ownerOf[access[resourceId][i]] == user) {
                return true;
            }
        }
        return false;
    }

    function getResource(bytes32 resourceId) external view returns (Resource memory) {
        if(hasAccess(msg.sender ,resourceId)) {
            return resources[resourceId];
        } else {
            revert("You do not have access");
        }
    }

    function getId(string memory name, string memory cid) external pure returns (bytes32 resourceId) {
        resourceId = keccak256(abi.encode(name, cid));
    }

    function addAccess(bytes32 resourceId, uint tokenId) external isOwner(tokenId) isResourceOwner(resourceId) {
        for (uint i = 0; i < access[resourceId].length; i++) {
            require(access[resourceId][i] != tokenId, "Already added");
        }
        access[resourceId].push(tokenId);
        emit AccessAdded(resourceId, tokenId);
    }

    function reclaimKey(uint tokenId) public isOwner(tokenId) {
        address currentHolder = _ownerOf[tokenId];
        require(currentHolder != msg.sender, "You already hold this key");
        safeTransferFrom(currentHolder, msg.sender, tokenId);
        emit KeyReclaimed(currentHolder, tokenId);
    }


    function removeNFTFromList(bytes32 resourceId, uint tokenId) external isResourceOwner(resourceId) {
        if (_ownerOf[tokenId] != msg.sender) {
            reclaimKey(tokenId);
        }
        uint length = access[resourceId].length;
        for (uint i=0; i<length; i++) {
            if(access[resourceId][i] == tokenId) {
                access[resourceId][i] = access[resourceId][length - 1];
                 access[resourceId].pop();
                 emit RemovedFromList(resourceId, tokenId);
                return;
            }
        }
    }

    function showAccess(bytes32 resourceId) external view isResourceOwner(resourceId) returns (uint[] memory) { 
        return access[resourceId];
    }

    function share(address receiver, uint tokenId) external {
        safeTransferFrom(msg.sender, receiver, tokenId);
    }
}
