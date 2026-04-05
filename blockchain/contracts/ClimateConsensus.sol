// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClimateConsensus {

    struct Study {
        string studyID;
        string doi;
        string cid;
        uint256 approvals;
        bool verified;
    }

    address public owner;
    uint256 public requiredApprovals = 2;

    // 🔹 Storage
    mapping(string => Study) public studies;
    mapping(address => bool) public validators;
    mapping(string => mapping(address => bool)) public voted;

    string[] public studyList; // ✅ IMPORTANT (for listing)

    // 🔔 Events
    event StudySubmitted(string studyID, string doi, string cid);
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

    // ➕ Add validator
    function addValidator(address _validator) public onlyOwner {
        require(_validator != address(0), "Invalid address");
        validators[_validator] = true;
        emit ValidatorAdded(_validator);
    }

    // 📤 Submit study
    function submitStudy(
        string memory _studyID,
        string memory _doi,
        string memory _cid
    ) public {
        require(bytes(_studyID).length > 0, "Invalid ID");
        require(bytes(_cid).length > 0, "Invalid CID");

        // Prevent duplicate
        require(bytes(studies[_studyID].studyID).length == 0, "Study exists");

        studies[_studyID] = Study({
            studyID: _studyID,
            doi: _doi,
            cid: _cid,
            approvals: 0,
            verified: false
        });

        studyList.push(_studyID); // ✅ store ID

        emit StudySubmitted(_studyID, _doi, _cid);
    }

    // ✅ Approve study (ONE vote per validator)
    function approveStudy(string memory _studyID) public onlyValidator {
        require(bytes(studies[_studyID].studyID).length != 0, "Study not found");
        require(!voted[_studyID][msg.sender], "Already voted");

        studies[_studyID].approvals++;
        voted[_studyID][msg.sender] = true;

        emit StudyApproved(_studyID, msg.sender);

        // 🎯 Consensus
        if (studies[_studyID].approvals >= requiredApprovals) {
            studies[_studyID].verified = true;
            emit StudyVerified(_studyID);
        }
    }

    // 📖 Get single study
    function getStudy(string memory _studyID)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        require(bytes(studies[_studyID].studyID).length != 0, "Study not found");

        Study memory s = studies[_studyID];
        return (s.studyID, s.doi, s.cid, s.approvals, s.verified);
    }

    // 📚 Get all study IDs
    function getAllStudies() public view returns (string[] memory) {
        return studyList;
    }

    // 🔍 Check if validator voted
    function hasVoted(string memory _studyID, address _validator)
        public
        view
        returns (bool)
    {
        return voted[_studyID][_validator];
    }

    // 🧠 Get ONLY pending studies for validator (NOT voted + NOT verified)
    function getPendingStudies(address _validator)
        public
        view
        returns (string[] memory)
    {
        uint count = 0;

        // First pass: count
        for (uint i = 0; i < studyList.length; i++) {
            string memory id = studyList[i];

            if (
                !voted[id][_validator] &&
                !studies[id].verified
            ) {
                count++;
            }
        }

        // Second pass: store
        string[] memory result = new string[](count);
        uint index = 0;

        for (uint i = 0; i < studyList.length; i++) {
            string memory id = studyList[i];

            if (
                !voted[id][_validator] &&
                !studies[id].verified
            ) {
                result[index] = id;
                index++;
            }
        }

        return result;
    }
}