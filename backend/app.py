import json, numpy as np, requests, io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity
from model_utils import Embedder

app = Flask(__name__)
CORS(app)

PRODUCTS_FILE = "products.json"
EMB_FILE = "embeddings.npy"

products = json.load(open(PRODUCTS_FILE))
embeddings = np.load(EMB_FILE)
embedder = Embedder()

@app.route("/search", methods=["POST"])
def search():
    # 1) Query image: file upload or URL
    if "file" in request.files:
        img = Image.open(request.files["file"].stream).convert("RGB")
    else:
        url = request.form.get("image_url")
        response = requests.get(url, timeout=10)
        img = Image.open(io.BytesIO(response.content)).convert("RGB")

    # 2) Embed query
    q = embedder.embed(img)

    # 3) Search
    sims = cosine_similarity([q], embeddings)[0]
    top_k = np.argsort(-sims)[:10]

    results = []
    for idx in top_k:
        results.append({
            **products[idx],
            "score": float(sims[idx])
        })

    return jsonify({"results": results})


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(port=5000)
