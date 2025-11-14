🔍 Visual Product Matcher
An AI-powered system that finds visually similar products from a catalog using image embeddings and cosine similarity.
Built using Flask, CLIP (Sentence-Transformers), React, TailwindCSS, and Vite.

🚀 Features

🧠 AI Visual Search
Upload an image or paste an image URL
Backend extracts image embeddings using CLIP
Finds top-10 visually similar products using cosine similarity

🗂 Mock Product Catalog
50+ sample products
Each product has:
name
category
image URL
embedding vector

🎨 Modern Frontend
Clean corporate UI (React + TailwindCSS)
Image preview
Similarity score filter
Pagination
Modal product viewer
Download/Export as PDF
Search history stored locally
Professional header/navbar

⚡ Fast Backend API
Built with Flask
Accepts file uploads & remote URLs
Returns similarity-sorted products
CORS enabled for frontend

🏗 Tech Stack
Frontend
React (Vite)
TailwindCSS
Axios
Modern, responsive UI
Backend
Python Flask
Sentence-Transformers (CLIP model)
NumPy, Pillow, scikit-learn
CORS enabled

📦 Project Structure

project-root/
│
├── backend/
│   ├── app.py
│   ├── generate_products.py
│   ├── generate_embeddings.py
│   ├── model_utils.py
│   ├── products.json
│   ├── embeddings.npy
│   ├── venv/ (ignored)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── components/
│   │       ├── ResultCard.jsx
│   │       ├── Pagination.jsx
│   │       ├── Modal.jsx
│   │       ├── LoadingSpinner.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│
└── README.md


🛠 Setup Instructions

1️⃣ Backend Setup (Flask)

🔹 Step 1: Create virtual environment
cd backend
python3 -m venv venv

🔹 Step 2: Activate (macOS/Linux)
source venv/bin/activate

🔹 Step 3: Install dependencies
pip install flask flask-cors pillow numpy scikit-learn sentence-transformers

🔹 Step 4: Generate product embeddings (only once)
python3 generate_embeddings.py

🔹 Step 5: Run backend
python3 app.py
Backend runs at:
👉 http://127.0.0.1:5000

2️⃣ Frontend Setup (React + Vite)

🔹 Step 1: Install dependencies
cd frontend
npm install

🔹 Step 2: Start dev server
npm run dev
Frontend runs at:
👉 http://localhost:5173

🔌 API Endpoints
POST /search
Find similar products.
Request (file upload):
file: <image>
Request (URL):
image_url: https://example.com/image.jpg

Response:
{
  "results": [
    {
      "id": 1,
      "name": "Red Shirt",
      "category": "T-Shirt",
      "image_url": "...",
      "score": 0.89
    }
  ]
}



🎯 Future Improvements
Better dataset
Multi-image search
Advanced filters (price, category, color)
Deploy on cloud (Render + Vercel)

🧑‍💻 Author
Tamada OmPrakash
Visual Product Matcher Assignment

✅ Final Note
This project demonstrates:
Frontend + backend integration
AI/ML embedding usage
API design
React UI development
Practical problem-solving









