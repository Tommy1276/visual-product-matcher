import numpy as np
from PIL import Image
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize

MODEL_NAME = "clip-ViT-B-32"

class Embedder:
    def __init__(self):
        self.model = SentenceTransformer(MODEL_NAME)

    def embed(self, img: Image.Image):
        emb = self.model.encode(img, convert_to_numpy=True)
        return normalize(emb.reshape(1, -1))[0]

