from sentence_transformers import SentenceTransformer
import numpy as np
from PIL import Image
import torchvision.transforms as T
import torch

class Embedder:
    def __init__(self):
        # CPU friendly model
        self.device = "cpu"
        self.model = SentenceTransformer("clip-ViT-B-32", device=self.device)

        self.preprocess = T.Compose([
            T.Resize((224, 224)),
            T.ToTensor(),
            T.Normalize([0.48145466, 0.4578275, 0.40821073],
                        [0.26862954, 0.26130258, 0.27577711])
        ])

    def embed(self, image: Image.Image):
        img = self.preprocess(image).unsqueeze(0)
        with torch.no_grad():
            emb = self.model.encode(img, convert_to_numpy=True)
        return emb[0]
