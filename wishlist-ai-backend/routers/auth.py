from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# import layers
import schemas
import models
from database import get_db
from utils.security import get_password_hash

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