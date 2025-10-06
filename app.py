import os
import traceback
import numpy as np
from PIL import Image
import tensorflow as tf
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# --- Configuration ---
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
MODEL_PATH = 'trained_Crop_disease_model.keras'
DISEASE_INFO_FILE = 'crop_disease_info.md'
IMG_HEIGHT = 128
IMG_WIDTH = 128

# --- Flask App Initialization ---
app = Flask(__name__, template_folder='templates')
CORS(app)


# --- Load the Pre-trained Model ---
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"FATAL: Error loading model: {e}")
    model = None

# --- Class Names ---
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# --- Function to Parse Disease Info from Markdown ---
# --- Function to Parse Disease Info from Markdown ---
TITLE_TO_CLASS_NAME_MAP = {
    'Apple Scab': 'Apple___Apple_scab',
    'Apple Black Rot': 'Apple___Black_rot',
    'Cedar Apple Rust': 'Apple___Cedar_apple_rust',
    'Apple (Healthy)': 'Apple___healthy',
    'Blueberry (Healthy)': 'Blueberry___healthy',
    'Cherry (including sour) Powdery Mildew': 'Cherry_(including_sour)___Powdery_mildew',
    'Cherry (including sour) (Healthy)': 'Cherry_(including_sour)___healthy',
    'Corn (maize) Cercospora Leaf Spot (Gray Leaf Spot)': 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn (maize) Common Rust': 'Corn_(maize)___Common_rust_',
    'Corn (maize) Northern Leaf Blight': 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn (maize) (Healthy)': 'Corn_(maize)___healthy',
    'Grape Black Rot': 'Grape___Black_rot',
    'Grape Esca (Black Measles)': 'Grape___Esca_(Black_Measles)',
    'Grape Leaf Blight (Isariopsis Leaf Spot)': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape (Healthy)': 'Grape___healthy',
    'Orange Haunglongbing (Citrus Greening)': 'Orange___Haunglongbing_(Citrus_greening)',
    'Peach Bacterial Spot': 'Peach___Bacterial_spot',
    'Peach (Healthy)': 'Peach___healthy',
    'Bell Pepper Bacterial Spot': 'Pepper,_bell___Bacterial_spot',
    'Bell Pepper (Healthy)': 'Pepper,_bell___healthy',
    'Potato Early Blight': 'Potato___Early_blight',
    'Potato Late Blight': 'Potato___Late_blight',
    'Potato (Healthy)': 'Potato___healthy',
    'Raspberry (Healthy)': 'Raspberry___healthy',
    'Soybean (Healthy)': 'Soybean___healthy',
    'Squash Powdery Mildew': 'Squash___Powdery_mildew',
    'Strawberry Leaf Scorch': 'Strawberry___Leaf_scorch',
    'Strawberry (Healthy)': 'Strawberry___healthy',
    'Tomato Bacterial Spot': 'Tomato___Bacterial_spot',
    'Tomato Early Blight': 'Tomato___Early_blight',
    'Tomato Late Blight': 'Tomato___Late_blight',
    'Tomato Leaf Mold': 'Tomato___Leaf_Mold',
    'Tomato Septoria Leaf Spot': 'Tomato___Septoria_leaf_spot',
    'Tomato Spider Mites (Two-spotted spider mite)': 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato Target Spot': 'Tomato___Target_Spot',
    'Tomato Yellow Leaf Curl Virus': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato Mosaic Virus': 'Tomato___Tomato_mosaic_virus',
    'Tomato (Healthy)': 'Tomato___healthy'
}

def _process_section(details, section_name, text_buffer):
    text_buffer = text_buffer.strip()
    if not text_buffer: return
    if section_name == "description":
        details["description"] = text_buffer
    # --- CHANGE THIS SECTION ---
    elif section_name in ["prevention", "remedies", "symptoms"]:
        details[section_name] = [item.strip() for item in text_buffer.split('||') if item.strip()]

def load_disease_info_from_markdown(file_path):
    disease_info_db = {}
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"ERROR: Could not read {file_path}: {e}")
        return {}

    disease_blocks = content.strip().split('\n\n')
    for block in disease_blocks:
        lines = block.strip().split('\n')
        if not lines:
            continue

        title = lines[0].strip()
        class_name_key = TITLE_TO_CLASS_NAME_MAP.get(title)
        if not class_name_key:
            continue

        details = {
            "description": "",
            "symptoms": [],
            "prevention": [],
            "remedies": []
        }

        for line in lines[1:]:
            if line.startswith("Definition:"):
                details["description"] = line.replace("Definition:", "").strip()
            elif line.startswith("Symptoms:"):
                symptoms_text = line.replace("Symptoms:", "").strip()
                details["symptoms"] = [s.strip() for s in symptoms_text.split("||") if s.strip()]
            elif line.startswith("Precautions:"):
                prevention_text = line.replace("Precautions:", "").strip()
                details["prevention"] = [p.strip() for p in prevention_text.split("||") if p.strip()]
            elif line.startswith("Treatment and Remedies:"):
                remedies_text = line.replace("Treatment and Remedies:", "").strip()
                details["remedies"] = [r.strip() for r in remedies_text.split("||") if r.strip()]

        disease_info_db[class_name_key] = details
    return disease_info_db

DISEASE_INFO_DB = load_disease_info_from_markdown(DISEASE_INFO_FILE)
if not DISEASE_INFO_DB: print("WARNING: Disease info database is empty.")
else: print(f"Successfully loaded information for {len(DISEASE_INFO_DB)} diseases.")

# --- Image Preprocessing ---
def preprocess_image(image):
    image = image.resize((IMG_HEIGHT, IMG_WIDTH))
    image_array = np.array(image)
    return np.expand_dims(image_array, axis=0)

# --- Routes ---
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None: return jsonify({'error': 'Model is not loaded properly.'}), 500
    if not DISEASE_INFO_DB: return jsonify({'error': 'Disease information is not loaded.'}), 500
    if 'image' not in request.files: return jsonify({'error': 'No image file found.'}), 400
    file = request.files['image']
    if file.filename == '': return jsonify({'error': 'No file selected.'}), 400
    try:
        image = Image.open(file.stream).convert('RGB')
        processed_image = preprocess_image(image)
        predictions = model.predict(processed_image)[0]
        predicted_class_index = np.argmax(predictions)
        confidence = float(predictions[predicted_class_index])
        class_name = CLASS_NAMES[predicted_class_index]
        disease_info = DISEASE_INFO_DB.get(class_name, {})
        # --- CHANGE THIS RESULT OBJECT ---
        result = {
            "disease_name": class_name.replace("___", " - ").replace('_', ' '),
            "confidence": confidence,
            "description": disease_info.get("description", "No description available."),
            "remedies": disease_info.get("remedies", []),
            "prevention": disease_info.get("prevention", []),
            "symptoms": disease_info.get("symptoms", [])
        }
        return jsonify({"prediction": result})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f'Prediction failed: {e}'}), 500

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)