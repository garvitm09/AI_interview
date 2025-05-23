from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoProcessor, HubertForSequenceClassification
import torchaudio
import torch
import tempfile
import asyncio
import io
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = AutoProcessor.from_pretrained("superb/hubert-large-superb-er")
model = HubertForSequenceClassification.from_pretrained("superb/hubert-large-superb-er")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    audio_buffer = bytearray()

    while True:
        data = await websocket.receive_bytes()
        audio_buffer.extend(data)

        if len(audio_buffer) >= 32000:  # ~1 second of 16kHz 16-bit mono PCM audio
            # Run inference
            audio_tensor = torch.tensor(np.frombuffer(audio_buffer, dtype=np.int16), dtype=torch.float32) / 32768.0
            audio_tensor = audio_tensor.unsqueeze(0)  # add batch dim
            inputs = processor(audio_tensor.squeeze(), sampling_rate=16000, return_tensors="pt")
            with torch.no_grad():
                logits = model(**inputs).logits
            predicted_class = torch.argmax(logits, dim=1).item()
            emotion_label = model.config.id2label[predicted_class]

            await websocket.send_text(emotion_label)
            audio_buffer = bytearray()  # reset buffer





# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import numpy as np
# import tensorflow as tf
# from PIL import Image
# import base64
# from io import BytesIO

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# # Load your model directly without TensorFlow Serving
# model = tf.keras.models.load_model("emotion_model_tf")  # Replace with your saved model directory

# @app.route("/predict", methods=["POST"])
# def predict():
#     data = request.get_json()
#     if not data or 'image' not in data:
#         return jsonify({"error": "No image data received"}), 400
    
#     # Process the base64 image
#     image_data = data['image'].split(",")[1]
#     img_bytes = base64.b64decode(image_data)
#     img = Image.open(BytesIO(img_bytes)).convert("L")  # Convert to grayscale
#     img = img.resize((48, 48))  # Resize image to 48x48
#     img_array = np.array(img)
#     img_array = img_array.astype('float32') / 255.0  # Normalize image

#     # Add batch dimension (1, 48, 48, 1)
#     img_array = np.expand_dims(img_array, axis=-1)
#     img_array = np.expand_dims(img_array, axis=0)

#     # Make the prediction using the model
#     prediction = model.predict(img_array)
    
#     # Map the prediction to the appropriate emotion
#     emotions = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]
#     emotion = np.argmax(prediction)

#     return jsonify({"emotion": emotions[emotion]})

# if __name__ == "__main__":
#     app.run(debug=True, port=5001)
