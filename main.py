from fastapi import FastAPI,UploadFile, File
from blockchain.scripts.deploy import deploy_blockchain
from backend.submit_study import submit
from backend.meta_analysis import meta_analysis
from backend.validator import validator

app = FastAPI()

@app.get('/')
def landing():
    return{"Server is Running "}

@app.get('/deploy')
def deploy():
    address=deploy_blockchain()
    return("Server is Running and deployed at",address)

@app.post('/submit_study')
async def submit_study(file: UploadFile = File(...)):
    result = submit(file)
    return {"message":result}

@app.post('/validator')
def validator_call():
    outcome= validator()
    return{outcome}

@app.post('/meta-analysis')
def meta_analysis_call():
    return meta_analysis()