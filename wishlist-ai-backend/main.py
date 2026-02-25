from fastapi import FastAPI

# Initialize FastAPI app
app = FastAPI(
    title="Wishlist AI Backend",
    description="Backend API for Wishlist AI application",
    version="1.0.0"
)

# Create FastAPI route
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Wishlist AI Backend!"}

