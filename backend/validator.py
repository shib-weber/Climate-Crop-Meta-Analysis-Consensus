from web3 import Web3
import json

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

with open("../abi/ClimateConsensus.json") as f:
    abi = json.load(f)

contract_address = "0x9AaCe56c0D5D77Ef872f632CdCe7475557EC735B"
contract = w3.eth.contract(address=contract_address, abi=abi)

validator_account = w3.eth.accounts[1]

study_id = "S1"

tx = contract.functions.approveStudy(study_id).transact({
    'from': validator_account,
    'gas': 5000000
})

w3.eth.wait_for_transaction_receipt(tx)

print("Study approved")