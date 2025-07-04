// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC165 {
    function supportInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721 is IERC165 {
    function balanceOf(address owner) external view returns (uint balance);

    function ownerOf(uint tokenId) external view returns (address owner);

    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint tokenId
    // ) internal;
    
    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint tokenId,
    //     bytes calldata data
    // ) external;

    // function transferFrom(
    //     address from,
    //     address to,
    //     uint tokenId
    // ) external;

    // function approve(address to, uint tokenId) external;

    // function getApproved(uint tokenId) external view returns (address operator);

    // function setApprovalForAll(address operator, bool _approved) external;

    // function isApprovedForAll(address owner, address operator) 
    //     external
    //     view
    //     returns (bool);
}

interface IERC721Receiver {
    function onERC721Received (
        address operator,
        address from,
        uint tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract ERC721 is IERC721 {
    event Transfer(address indexed from, address indexed to, uint indexed id);
    // event Approval(address indexed owner, address indexed spender, uint indexed id);
    // event ApprovalForAll(
    //     address indexed owner,
    //     address indexed operator,
    //     bool approved
    // );

    mapping(uint => address) internal _ownerOf;
    mapping(address => uint) internal _balanceOf;
    // mapping(uint => address) internal _approvals;
    // mapping(address => mapping(address => bool)) public isApprovedForAll;

    function supportInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC721).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    function balanceOf(address owner) external view returns (uint balance) {
        require(owner != address(0), "Zero address");
        return _balanceOf[owner];
    }

    function ownerOf(uint tokenId) external view returns (address owner) {
        owner = _ownerOf[tokenId];
        require(owner != address(0), "Not exist");
    }

    // function approve(address to, uint tokenId) external {
    //     address owner = _ownerOf[tokenId];
    //     require(msg.sender == owner || isApprovedForAll[owner][msg.sender], "Not allowed access!");
        
    //     _approvals[tokenId] = to;
    //     emit Approval(msg.sender, to, tokenId);
    // }

    // function setApprovalForAll(address operator, bool _approved) external {
    //     isApprovedForAll[msg.sender][operator] = _approved;
    //     emit ApprovalForAll(msg.sender, operator, _approved);
    // }

    // function getApproved(uint tokenId) external view returns (address operator) {
    //     require(_ownerOf[tokenId] != address(0), "Token does not exist");
    //     return _approvals[tokenId];
    // }

    // function _isApprovedOrOwner(
    //     address owner,
    //     address spender,
    //     uint tokenId
    // ) internal view returns (bool) {
    //     return (
    //         spender == owner ||
    //         isApprovedForAll[owner][spender] ||
    //         spender == _approvals[tokenId]
    //     );
    // }

    function transferFrom(
        address from,
        address to,
        uint tokenId
    ) internal {
        require(from == _ownerOf[tokenId], "From != owner");
        require(to != address(0), "Zero Address");
        // require(_isApprovedOrOwner(from, msg.sender, tokenId), "Not authorized");

        _balanceOf[from]--;
        _balanceOf[to]++;
        _ownerOf[tokenId] = to;
        // delete _approvals[tokenId];
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) internal {
        transferFrom(from, to, tokenId);

        require(
            to.code.length == 0 ||
            IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, "") == IERC721Receiver.onERC721Received.selector, 
            "Unsafe recipient"
        );
    }

    function safeTransferFrom(
        address from,
        address to,
        uint tokenId,
        bytes calldata data
    ) internal  {
        transferFrom(from, to, tokenId);

        require(
            to.code.length == 0 ||
            IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) == IERC721Receiver.onERC721Received.selector, 
            "Unsafe recipient"
        );
    }

    function _mint(address to, uint tokenId) internal {
        require(to != address(0), "Zero Address");
        require(_ownerOf[tokenId] == address(0), "Already Exists");

        _balanceOf[to]++;
        _ownerOf[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }

    function _burn(uint tokenId) internal {
        address owner = _ownerOf[tokenId];
        require(owner != address(0), "Token does not exist");

        _balanceOf[owner]--;
        delete _ownerOf[tokenId];
        // delete _approvals[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }
}
