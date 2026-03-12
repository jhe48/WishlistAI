from fastapi import FastAPI
from routers import auth            # Import the auth router.

app = FastAPI(title="WishlistAI API")

# Mount the router onto the main application.
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the WishlistAI API"}