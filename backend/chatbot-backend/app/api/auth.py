from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
import hashlib
import secrets
import jwt
from datetime import datetime, timedelta
import sqlite3
import os
from app.config import Config

router = APIRouter()

# Secret key for JWT tokens - in production, use a strong secret from environment
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database setup
DB_PATH = os.getenv("DATABASE_PATH", "users.db")

def init_db():
    """Initialize the database and create users table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password: str) -> str:
    """Hash a password using salt."""
    salt = secrets.token_hex(16)
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return salt + pwdhash.hex()

def verify_password(password: str, stored_hash: str) -> bool:
    """Verify a password against its hash."""
    salt = stored_hash[:32]  # First 32 chars is the salt
    stored_pwd = stored_hash[32:]
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return pwdhash.hex() == stored_pwd

def create_access_token(data: dict):
    """Create a JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str):
    """Get a user by email from the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, name, password_hash FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return {
            "id": user[0],
            "email": user[1],
            "name": user[2],
            "password_hash": user[3]
        }
    return None

class SignUpRequest(BaseModel):
    email: str
    name: Optional[str] = None
    password: str

class SignUpResponse(BaseModel):
    user: dict
    session: dict

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    user: dict
    session: dict

class SessionResponse(BaseModel):
    user: dict
    session: dict

# Initialize the database
init_db()

@router.post("/auth/sign-up/email", response_model=SignUpResponse)
async def sign_up_email(request: SignUpRequest):
    """Sign up a new user with email and password."""
    # Check if user already exists
    existing_user = get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Hash the password
    password_hash = hash_password(request.password)

    # Create the user in the database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
            (request.email, request.name, password_hash)
        )
        user_id = cursor.lastrowid
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail="Failed to create user")

    conn.close()

    # Get the created user
    user = {
        "id": user_id,
        "email": request.email,
        "name": request.name
    }

    # Create session token
    access_token = create_access_token(data={"user_id": user_id, "email": request.email})

    session = {
        "token": access_token,
        "expires_at": (datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).isoformat()
    }

    return SignUpResponse(user=user, session=session)

@router.post("/auth/sign-in/email", response_model=LoginResponse)
async def sign_in_email(request: LoginRequest):
    """Sign in a user with email and password."""
    # Get user by email
    user = get_user_by_email(request.email)
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create session token
    access_token = create_access_token(data={"user_id": user["id"], "email": user["email"]})

    session = {
        "token": access_token,
        "expires_at": (datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).isoformat()
    }

    # Return user without password hash
    user_data = {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"]
    }

    return LoginResponse(user=user_data, session=session)

@router.post("/auth/session", response_model=SessionResponse)
async def get_session(request: Request):
    """Get the current session based on the authorization header."""
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No valid session token provided")

    token = auth_header[7:]  # Remove "Bearer " prefix

    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        email = payload.get("email")

        if not user_id or not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Get user from database
        user = get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # Create session data
        session = {
            "token": token,
            "expires_at": (datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).isoformat()
        }

        # Return user data without password hash
        user_data = {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }

        return SessionResponse(user=user_data, session=session)

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token validation error: {str(e)}")

@router.post("/auth/sign-out")
async def sign_out():
    """Sign out the user (no actual state to clear in JWT-based system)."""
    return {"success": True}