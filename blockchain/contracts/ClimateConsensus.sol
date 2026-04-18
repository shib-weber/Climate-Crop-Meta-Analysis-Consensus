// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClimateConsensus {

    struct Study {
        string studyID;   // human readable
        string doi;
        string cid;
        uint256 approvals;
        bool verified;
        bool exists;
    }

    address public owner;
    uint256 public requiredApprovals = 2;

    // 🔹 Optimized storage (bytes32 keys)
    mapping(bytes32 => Study) private studies;
    mapping(address => bool) public validators;
    mapping(bytes32 => mapping(address => bool)) public voted;

    bytes32[] private studyList;

    // 🔔 Events
    event StudySubmitted(bytes32 indexed studyHash, string studyID, string doi, string cid);
    event StudyApproved(bytes32 indexed studyHash, address validator);
    event StudyVerified(bytes32 indexed studyHash);
    event ValidatorAdded(address validator);
    event ValidatorRemoved(address validator);

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

    // 🔑 Internal hash function
    function _hash(string memory _studyID) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_studyID));
    }

    // ➕ Add validator
    function addValidator(address _validator) external onlyOwner {
        require(_validator != address(0), "Invalid address");
        require(!validators[_validator], "Already validator");

        validators[_validator] = true;
        emit ValidatorAdded(_validator);
    }

    // ➖ Remove validator (NEW)
    function removeValidator(address _validator) external onlyOwner {
        require(validators[_validator], "Not validator");

        validators[_validator] = false;
        emit ValidatorRemoved(_validator);
    }

    // 📤 Submit study
    function submitStudy(
        string memory _studyID,
        string memory _doi,
        string memory _cid
    ) external {
        require(bytes(_studyID).length > 0, "Invalid ID");
        require(bytes(_cid).length > 0, "Invalid CID");

        bytes32 id = _hash(_studyID);

        require(!studies[id].exists, "Study exists");

        studies[id] = Study({
            studyID: _studyID,
            doi: _doi,
            cid: _cid,
            approvals: 0,
            verified: false,
            exists: true
        });

        studyList.push(id);

        emit StudySubmitted(id, _studyID, _doi, _cid);
    }

    // ✅ Approve study
    function approveStudy(string memory _studyID) external onlyValidator {
        bytes32 id = _hash(_studyID);

        require(studies[id].exists, "Study not found");
        require(!studies[id].verified, "Already verified");
        require(!voted[id][msg.sender], "Already voted");

        studies[id].approvals++;
        voted[id][msg.sender] = true;

        emit StudyApproved(id, msg.sender);

        // 🎯 Consensus
        if (studies[id].approvals >= requiredApprovals) {
            studies[id].verified = true;
            emit StudyVerified(id);
        }
    }

    // 📖 Get single study
    function getStudy(string memory _studyID)
        external
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        bytes32 id = _hash(_studyID);

        require(studies[id].exists, "Study not found");

        Study memory s = studies[id];
        return (s.studyID, s.doi, s.cid, s.approvals, s.verified);
    }

    // 📚 Get all study IDs (WARNING: grows unbounded)
    function getAllStudies() external view returns (string[] memory) {
        string[] memory result = new string[](studyList.length);

        for (uint i = 0; i < studyList.length; i++) {
            result[i] = studies[studyList[i]].studyID;
        }

        return result;
    }

    // 🔍 Check vote
    function hasVoted(string memory _studyID, address _validator)
        external
        view
        returns (bool)
    {
        bytes32 id = _hash(_studyID);
        return voted[id][_validator];
    }

    // 🧠 Get pending studies (optimized)
    function getPendingStudies(address _validator)
        external
        view
        returns (string[] memory)
    {
        uint count = 0;

        // count first
        for (uint i = 0; i < studyList.length; i++) {
            bytes32 id = studyList[i];

            if (!voted[id][_validator] && !studies[id].verified) {
                count++;
            }
        }

        string[] memory result = new string[](count);
        uint index = 0;

        for (uint i = 0; i < studyList.length; i++) {
            bytes32 id = studyList[i];

            if (!voted[id][_validator] && !studies[id].verified) {
                result[index++] = studies[id].studyID;
            }
        }

        return result;
    }

    // ⚙️ Update approvals (NEW flexibility)
    function setRequiredApprovals(uint256 _count) external onlyOwner {
        require(_count > 0, "Invalid count");
        requiredApprovals = _count;
    }
}