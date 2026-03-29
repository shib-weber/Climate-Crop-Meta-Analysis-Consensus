from fastapi import FastAPI,UploadFile, File,HTTPException
from pydantic import BaseModel
import mysql.connector
from mysql.connector import pooling
from fastapi.middleware.cors import CORSMiddleware
from blockchain.scripts.deploy import deploy_blockchain
from backend.submit_study import submit
from backend.meta_analysis import meta_analysis
from backend.validator import validator
from dotenv import load_dotenv
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "crop-climate-3513c60299c8.json"

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

@app.post('/submit_study')
async def submit_study(file: UploadFile = File(...)):
    result = submit(file)
    return {"message":result}

@app.post('/validator')
def validator_call():
    outcome= validator()
    return{outcome}

@app.get('/meta-analysis')
def meta_analysis_call():
    return meta_analysis()