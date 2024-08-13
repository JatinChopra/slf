// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MusicNFT is ERC721URIStorage {
    uint256 private _tokenIdCounter;

    mapping(uint256 => address) private _tokenArtists;

    constructor() ERC721("MusicNFT", "MNFT") {}

    // Allow artists to mint their own NFTs with an auto-incremented token ID
    function mintArtistNFT(string memory tokenURI) public {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _tokenArtists[tokenId] = msg.sender; // Set the artist as the minter
        _tokenIdCounter += 1;
    }

    // Function to check who minted the token
    function getArtist(uint256 tokenId) public view returns (address) {
        return _tokenArtists[tokenId];
    }
}
