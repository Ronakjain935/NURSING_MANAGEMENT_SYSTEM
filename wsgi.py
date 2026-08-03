"""
PlantVerse AI - WSGI/ASGI Production Entry Point for Gunicorn & Render
"""
from main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("wsgi:app", host="0.0.0.0", port=8000, reload=True)
