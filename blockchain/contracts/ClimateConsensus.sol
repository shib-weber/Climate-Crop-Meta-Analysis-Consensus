// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClimateConsensus {

    struct Study {
        string studyID;
        string doi;
        bytes32 dataHash;
        uint approvals;
        bool verified;
    }

    mapping(string => Study) public studies;
    mapping(address => bool) public validators;
    mapping(string => mapping(address => bool)) public voted;

    uint constant MIN_APPROVALS = 2;

    constructor() {
        validators[msg.sender] = true;
    }

    function addValidator(address _validator) public {
        validators[_validator] = true;
    }

    function submitStudy(
        string memory _studyID,
        string memory _doi,
        bytes32 _dataHash
    ) public {
        studies[_studyID] = Study(_studyID, _doi, _dataHash, 0, false);
    }

    function approveStudy(string memory _studyID) public {
        require(validators[msg.sender], "Not validator");
        require(!voted[_studyID][msg.sender], "Already voted");

        voted[_studyID][msg.sender] = true;
        studies[_studyID].approvals++;

        if (studies[_studyID].approvals >= MIN_APPROVALS) {
            studies[_studyID].verified = true;
        }
    }

    function getStudy(string memory _studyID)
        public view returns (string memory, string memory, uint, bool)
    {
        Study memory s = studies[_studyID];
        return (s.studyID, s.doi, s.approvals, s.verified);
    }
}