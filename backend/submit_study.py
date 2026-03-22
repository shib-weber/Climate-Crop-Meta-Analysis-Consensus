from web3 import Web3
import pandas as pd
from .hash_utils import generate_hash
import json
from dotenv import load_dotenv
import os

load_dotenv()

def submit(file):
    w3 = Web3(Web3.HTTPProvider(os.getenv("GANACHE_URL")))

    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    abi_path = os.path.join(current_dir, "..", "abi", "ClimateConsensus.json")
    abi_path = os.path.normpath(abi_path)


    if not os.path.exists(abi_path):
        raise FileNotFoundError(f"ABI not found: {abi_path}")

    with open(abi_path, "r") as f:
        abi = json.load(f)

    contract_address = os.getenv("YOUR_CONTRACT_ADDRESS")
    contract = w3.eth.contract(address=contract_address, abi=abi)

    account = w3.eth.accounts[0]


    df = pd.read_csv(file.file)

    for _, row in df.iterrows():
        study_data = row.to_dict()
        hash_value = generate_hash(study_data)

        tx = contract.functions.submitStudy(
            row["Study_ID"],
            row["DOI"],
            Web3.to_bytes(hexstr=hash_value)
        ).transact({
            'from': account,
            'gas': 5000000
        })

        w3.eth.wait_for_transaction_receipt(tx)

    return "Studies submitted"