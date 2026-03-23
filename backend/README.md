# Backend

This project uses FastAPI.

## Getting Started

1. (Recommended) Create a virtual environment:
   ```sh
   python -m venv venv
   ```
2. Activate the virtual environment and install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Create a `.env` file from `.env.example` and set:
   ```sh
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-5
   FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```
4. Run the server:
   ```sh
   uvicorn main:app --reload
   ```
