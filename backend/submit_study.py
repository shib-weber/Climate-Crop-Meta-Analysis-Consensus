from web3 import Web3
import pandas as pd
from hash_utils import generate_hash
import json

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

with open("../abi/ClimateConsensus.json") as f:
    abi = json.load(f)

contract_address = "0x9AaCe56c0D5D77Ef872f632CdCe7475557EC735B"
contract = w3.eth.contract(address=contract_address, abi=abi)

account = w3.eth.accounts[0]

df = pd.read_csv("../data/studies.csv")

for _, row in df.iterrows():
    study_data = row.to_dict()
    hash_value = generate_hash(study_data)

    tx = contract.functions.submitStudy(
        row["Study_ID"],
        row["DOI"],
        Web3.to_bytes(hexstr=hash_value)
    ).transact({'from': account,'gas': 5000000})

    w3.eth.wait_for_transaction_receipt(tx)

print("Studies submitted")