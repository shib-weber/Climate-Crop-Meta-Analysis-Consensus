from fastapi import FastAPI,UploadFile, File,HTTPException,Form,Body
from pydantic import BaseModel
import mysql.connector
from mysql.connector import pooling
from fastapi.middleware.cors import CORSMiddleware
from blockchain.scripts.deploy import deploy_blockchain
from backend.submit_study import submit
from backend.meta_analysis import meta_analysis
from backend.add_validator import add_validator
from backend.routes.dash import router as dashboard_router
from dotenv import load_dotenv
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "crop-climate-3932749433d7.json"

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MySQL Configuration ---
db_config = {
    "host": "localhost",
    "user": "root",
    "password": os.getenv('MYSQLPASSWORD'),
    "database": "research_platform"
}

# Create a connection pool for better performance
db_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mypool", pool_size=5, **db_config
)

# Pydantic model for the registration request
class UserRegistration(BaseModel):
    wallet_address: str

# --- New Registration Route ---
@app.post('/register')
async def register_user(user: UserRegistration):
    wallet = user.wallet_address.lower()
    
    try:
        conn = db_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE wallet_address = %s", (wallet,))
        existing_user = cursor.fetchone()

        if not existing_user:
            # Create account with default 'researcher' role
            cursor.execute(
                "INSERT INTO users (wallet_address, role) VALUES (%s, %s)",
                (wallet, "researcher")
            )
            conn.commit()
            return {"message": "Account created", "role": "researcher"}
        
        return {"message": "Welcome back", "role": existing_user['role']}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        cursor.close()
        conn.close()

@app.get('/')
def landing():
    return{"Server is Running "}

@app.get('/deploy')
def deploy():
    address=deploy_blockchain()
    return("Server is Running and deployed at",address)

@app.post("/submit_study")
async def submit_study(
    file: UploadFile = File(...),
    studyID: str = Form(...),
    doi: str = Form(...)
):
    result = submit(file, studyID, doi)
    return result


@app.get('/meta-analysis')
def meta_analysis_call():
    return meta_analysis()

@app.post("/make_validator")

async def make_validator(wallet: str=Body(...)):
    print('here')
    print(wallet)
    c_wallet = wallet.strip().strip('"')
    try:
        tx_hash = add_validator(c_wallet)
        return {
            "status": "success",
            "tx_hash": tx_hash
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
        
app.include_router(dashboard_router)