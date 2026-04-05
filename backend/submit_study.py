import os
import requests
from dotenv import load_dotenv

load_dotenv()

def submit(file, study_id, doi):
    try:
        # Upload to Pinata ONLY
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
            raise Exception(response.text)

        data = response.json()
        cid = data["IpfsHash"]

        return {
            "status": "success",
            "cid": cid,
            "ipfs_url": f"https://gateway.pinata.cloud/ipfs/{cid}"
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}