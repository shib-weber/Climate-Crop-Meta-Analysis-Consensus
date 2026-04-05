from fastapi import APIRouter
from web3 import Web3
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GANACHE_URL = os.getenv("GANACHE_URL")
CONTRACT_ADDRESS = os.getenv("YOUR_CONTRACT_ADDRESS")

# ⚠️ manually track validators
VALIDATORS = [
    Web3.to_checksum_address("0xbc9efebce4ccc6c85a22cbb7f41d526eb329b374"),
    Web3.to_checksum_address("0x6bb2555c91d8e533af289fa4f1214dd6a0b5666c"),
]

# 🔗 Web3 setup
w3 = Web3(Web3.HTTPProvider(GANACHE_URL))

# 📄 Load ABI
current_dir = os.path.dirname(os.path.abspath(__file__))
abi_path = os.path.join(current_dir,"..", "..", "abi", "ClimateConsensus.json")

with open(abi_path, "r") as f:
    contract_json = json.load(f)
    abi = contract_json["abi"] if "abi" in contract_json else contract_json

contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=abi
)


@router.get("/dashboard")
def full_dashboard():
    try:
        ids = contract.functions.getAllStudies().call()

        studies = []
        for study_id in ids:
            s = contract.functions.getStudy(study_id).call()

            studies.append({
                "id": s[0],
                "doi": s[1],
                "cid": s[2],
                "approvals": s[3],
                "verified": s[4]
            })

        validator_stats = []

        for v in VALIDATORS:
            pending = contract.functions.getPendingStudies(v).call()

            validator_stats.append({
                "validator": v,
                "pending": len(pending)
            })

        return {
            "status": "success",
            "total_studies": len(studies),
            "studies": studies,
            "validators": validator_stats
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}