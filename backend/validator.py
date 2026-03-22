from web3 import Web3
import json
from dotenv import load_dotenv
import os

load_dotenv()

def validator():
    w3 = Web3(Web3.HTTPProvider(os.getenv("GANACHE_URL")))

    current_dir = os.path.dirname(os.path.abspath(__file__))

    abi_path = os.path.join(current_dir, "..", "abi", "ClimateConsensus.json")
    abi_path = os.path.normpath(abi_path)

    if not os.path.exists(abi_path):
        raise FileNotFoundError(f"ABI not found at {abi_path}")

    with open(abi_path, "r") as f:
        abi = json.load(f)

    contract_address = os.getenv("YOUR_CONTRACT_ADDRESS")
    contract = w3.eth.contract(address=contract_address, abi=abi)

    validator_account = w3.eth.accounts[1]

    study_id = "S1"

    tx = contract.functions.approveStudy(study_id).transact({
        'from': validator_account,
        'gas': 5000000
    })

    w3.eth.wait_for_transaction_receipt(tx)

    return "Study approved"