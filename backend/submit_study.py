import os
import json
import requests
import traceback # Added for deep debugging
from web3 import Web3
from dotenv import load_dotenv

# 🔹 Load environment variables
load_dotenv()

# 🔹 Setup Web3
w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))

private_key = os.getenv("PRIVATE_KEY")
account = w3.eth.account.from_key(private_key)

print("--- NODE INITIALIZED ---")
print("Using account:", account.address)
print("Connected to Chain ID:", w3.eth.chain_id)
print("Wallet Balance:", w3.from_wei(w3.eth.get_balance(account.address), 'ether'), "ETH/MATIC")

# 🔹 Load ABI
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ABI_PATH = os.path.join(BASE_DIR, "..", "abi", "ClimateConsensus.json")

with open(ABI_PATH) as f:
    abi = json.load(f)

# 🔹 Contract setup
contract = w3.eth.contract(
    address=Web3.to_checksum_address(os.getenv("YOUR_CONTRACT_ADDRESS")),
    abi=abi
)

def submit(file, study_id, doi):
    try:
        print("Starting IPFS upload...")

        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

        headers = {
            "pinata_api_key": os.getenv("PINATA_API_KEY"),
            "pinata_secret_api_key": os.getenv("PINATA_SECRET_API_KEY")
        }

        file.file.seek(0)

        files = {
            "file": (file.filename, file.file, file.content_type)
        }

        response = requests.post(url, files=files, headers=headers)

        if response.status_code != 200:
            raise Exception("Pinata Error: " + response.text)

        data = response.json()
        cid = data["IpfsHash"]

        print("✅ CID:", cid)

        return {
            "status": "success",
            "cid": cid
        }

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return {
            "status": "error",
            "message": str(e)
        }