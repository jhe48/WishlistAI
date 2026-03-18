from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

# import layers
import schemas
import models
from database import get_db
from utils.security import get_password_hash, verify_password, create_access_token

# initialize the router
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_credentials: schemas.UserCreate, db: AsyncSession = Depends(get_db)):

    # 1 Check if the user already exists
    query = select(models.User).where(models.User.email == user_credentials.email)
    result = await db.execute(query)
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 2 Hash the password
    hashed_pwd = get_password_hash(user_credentials.password)

    # 3 Create the new SQLAlchemy user object
    new_user = models.User(
        email=user_credentials.email,
        username=user_credentials.username,
        password_hash=hashed_pwd
    )

    # 4 Add to database and commit
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # 5 Return the new User (FastAPI automatically strips the password hash due to the response_model)
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login_user(user_credentials: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    # 1. Fetch user from database
    query = select(models.User).where(models.User.email == user_credentials.email)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # 2. Verify hashed password
    if not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # 3. Create JWT Token (Matching the 1-week duration in our Next.js cookie)
    access_token_expires = timedelta(days=7)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    # 4. Return token back to Next.js server actions
    return {"access_token": access_token, "token_type": "bearer"}