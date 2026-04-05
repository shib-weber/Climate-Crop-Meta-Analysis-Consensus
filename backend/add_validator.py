def add_validator(wallet):
    from web3 import Web3
    import json
    import os

    GANACHE_URL = os.getenv("GANACHE_URL")
    CONTRACT_ADDRESS = os.getenv("YOUR_CONTRACT_ADDRESS")

    if not GANACHE_URL or not CONTRACT_ADDRESS:
        raise Exception("Missing environment variables")

    w3 = Web3(Web3.HTTPProvider(GANACHE_URL))

    if not w3.is_connected():
        raise Exception("Web3 not connected")

    # 🔥 Load ABI safely (FIXED)
    with open("abi/ClimateConsensus.json") as f:
        contract_json = json.load(f)
        abi = contract_json["abi"] if isinstance(contract_json, dict) and "abi" in contract_json else contract_json

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(CONTRACT_ADDRESS),
        abi=abi
    )

    # 🔐 Ensure valid wallet
    try:
        wallet = Web3.to_checksum_address(wallet)
    except Exception:
        raise Exception("Invalid wallet address")

    owner = w3.eth.accounts[0]  # MUST be deployer

    # 🔍 Optional: check if already validator (prevents waste tx)
    is_validator = contract.functions.validators(wallet).call()
    if is_validator:
        return "Already a validator"

    # 🚀 Send transaction
    tx_hash = contract.functions.addValidator(wallet).transact({
        "from": owner,
        "gas": 200000
    })

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return receipt.transactionHash.hex()