# generate_embeddings.py
import os, json, numpy as np, requests
from PIL import Image
from io import BytesIO
from model_utils import Embedder

PRODUCTS_FILE = "products.json"
EMB_FILE = "embeddings.npy"

embedder = Embedder()
products = json.load(open(PRODUCTS_FILE))
embs = []

print("Generating embeddings for", len(products), "products...")

for p in products:
    try:
        response = requests.get(p["image_url"], timeout=10)
        img = Image.open(BytesIO(response.content)).convert("RGB")
        emb = embedder.embed(img)
        embs.append(emb)
    except Exception as e:
        print("Error embedding:", p["id"], e)
        embs.append(np.zeros(512))

np.save(EMB_FILE, np.vstack(embs))
print("Done → embeddings.npy created!")
