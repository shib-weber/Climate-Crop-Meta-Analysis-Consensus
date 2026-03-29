// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClimateConsensus {

    struct Study {
        string studyID;
        string doi;
        bytes32 dataHash;
        uint256 approvals;
        bool verified;
    }

    address public owner;
    uint256 public requiredApprovals = 2;

    mapping(string => Study) public studies;
    mapping(address => bool) public validators;
    mapping(string => mapping(address => bool)) public voted;

    // 🔔 Events (important for frontend)
    event StudySubmitted(string studyID, string doi);
    event StudyApproved(string studyID, address validator);
    event StudyVerified(string studyID);
    event ValidatorAdded(address validator);

    constructor() {
        owner = msg.sender;
    }

    // 🔒 Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyValidator() {
        require(validators[msg.sender], "Not validator");
        _;
    }

    // ➕ Add validator (only owner)
    function addValidator(address _validator) public onlyOwner {
        require(_validator != address(0), "Invalid address");
        validators[_validator] = true;
        emit ValidatorAdded(_validator);
    }

    // 📤 Submit study
    function submitStudy(
        string memory _studyID,
        string memory _doi,
        bytes32 _dataHash
    ) public {
        require(bytes(_studyID).length > 0, "Invalid ID");

        // Prevent duplicate
        require(bytes(studies[_studyID].studyID).length == 0, "Study exists");

        studies[_studyID] = Study({
            studyID: _studyID,
            doi: _doi,
            dataHash: _dataHash,
            approvals: 0,
            verified: false
        });

        emit StudySubmitted(_studyID, _doi);
    }

    // ✅ Approve study (only validators)
    function approveStudy(string memory _studyID) public onlyValidator {
        require(bytes(studies[_studyID].studyID).length != 0, "Study not found");
        require(!voted[_studyID][msg.sender], "Already voted");

        studies[_studyID].approvals++;
        voted[_studyID][msg.sender] = true;

        emit StudyApproved(_studyID, msg.sender);

        // 🎯 Consensus logic
        if (studies[_studyID].approvals >= requiredApprovals) {
            studies[_studyID].verified = true;
            emit StudyVerified(_studyID);
        }
    }

    // 📖 Get study (custom getter like ABI)
    function getStudy(string memory _studyID)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        require(bytes(studies[_studyID].studyID).length != 0, "Study not found");

        Study memory s = studies[_studyID];
        return (s.studyID, s.doi, s.approvals, s.verified);
    }
}