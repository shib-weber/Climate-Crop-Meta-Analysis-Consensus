import hashlib
import json

def generate_hash(study_data):
    study_string = json.dumps(study_data, sort_keys=True)
    return hashlib.sha256(study_string.encode()).hexdigest()