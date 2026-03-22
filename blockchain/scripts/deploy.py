from web3 import Web3
import json
from dotenv import load_dotenv
import os

load_dotenv()

def deploy_blockchain():
    print('im here')

    w3 = Web3(Web3.HTTPProvider(os.getenv("GANACHE_URL")))

    # ✅ Get current file directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # ✅ Build absolute path safely
    abi_path = os.path.join(current_dir, "..", "..", "abi", "ClimateConsensus.json")
    abi_path = os.path.normpath(abi_path)

    # ✅ Load ABI safely
    with open(abi_path, "r") as f:
        abi = json.load(f)

    bytecode = os.getenv("BYTE_CODE")
    account = w3.eth.accounts[0]

    Contract = w3.eth.contract(abi=abi, bytecode=bytecode)

    tx_hash = Contract.constructor().transact({
        'from': account,
        'gas': 5000000
    })

    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_receipt.contractAddress