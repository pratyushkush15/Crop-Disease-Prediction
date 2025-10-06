# Crop Disease Prediction System

This project implements an end-to-end system for classifying plant diseases from leaf images using a Deep Learning model (Convolutional Neural Network) and serving the predictions via a Flask-based RESTful API.

## 1. Project Overview

The core of this system is a CNN trained to identify 38 different classes of plant diseases and healthy states across various crops. The system consists of:

1.  **`Train.ipynb`**: The Jupyter Notebook used for **building, training, and evaluating the CNN model**.
2.  **`trained_Crop_disease_model.keras`**: The resulting **trained model file**.
3.  **`Test.ipynb`**: A notebook for **testing the loaded model** on a single image and verifying the class name mapping.
4.  **`app.py`**: A **Flask API** that loads the trained model and serves predictions for uploaded images, including returning specific disease information.
5.  **`crop_disease_info.md`**: A markdown file containing **detailed information** (description, symptoms, prevention, remedies) for each disease class.

## 2. Setup and Installation

### Prerequisites

* Python 3.8+
* pip (Python package installer)
* A dedicated virtual environment is highly recommended.

### Environment Setup

1.  **Create and Activate a Virtual Environment (Optional but Recommended):**
    ```bash
    python -m venv venv
    # On Windows
    .\venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

2.  **Install Dependencies:**
    The project relies on standard data science and web frameworks.

    ```bash
    pip install tensorflow numpy flask flask-cors Pillow opencv-python matplotlib scikit-learn seaborn
    # Note: The notebooks also use pandas and cv2 (opencv-python).
    ```

### File Structure

Your project directory should be structured as follows:

crop-disease-predictor/
├── trained_Crop_disease_model.keras  # The trained Keras model
├── app.py                          # The Flask API application
├── crop_disease_info.md            # Disease details (Symptoms, Remedies, etc.)
├── Train.ipynb                     # Training notebook
├── Test.ipynb                      # Testing notebook
├── venv/                           # (Optional) Python Virtual Environment
└── ...                             # Data directories (train, valid, etc.)


***Note:*** *The `Train.ipynb` notebook expects the data folders (`train`, `valid`) to be in the same directory as the notebook.*

## 3. Training the Model (`Train.ipynb`)

The `Train.ipynb` notebook covers the complete machine learning lifecycle for the CNN.

### Model Architecture Highlights

The model is a Deep Convolutional Neural Network with a focus on capturing complex image features:

* **Input Layer:** `(128, 128, 3)` for color images.
* **Convolutional Blocks:** Five blocks, each consisting of:
    * `Conv2D` layers with `relu` activation and `padding='same'` (or default).
    * Increasing number of filters: 32, 64, 128, 256, and 512.
    * `MaxPool2D` to downsample the feature maps.
* **Regularization:** `Dropout(0.25)` is applied after the final max-pooling block to prevent overfitting.
* **Classifier:**
    * `Flatten` layer.
    * `Dense` layer with **1500 units** and `relu` activation.
    * Another `Dropout(0.4)` layer.
    * **Output Layer:** `Dense` layer with **38 units** (corresponding to the 38 classes) and `softmax` activation.
* **Compilation:** Uses the **Adam optimizer** with a small `learning_rate` of **0.0001** and `categorical_crossentropy` loss.
* **Training:** Trained for **10 epochs**.

### Key Results (From Notebook Output)

| Metric | Training Set | Validation Set |
| :--- | :--- | :--- |
| **Accuracy** | 0.9912 | 0.9706 |
| **Loss** | 0.0252 | 0.0980 |

The high accuracy suggests the model is a strong predictor for this dataset.

## 4. Testing and Prediction (`Test.ipynb` and `app.py`)

### Notebook Testing (`Test.ipynb`)

The `Test.ipynb` notebook demonstrates how to load the saved model (`trained_Crop_disease_model.keras`) and make a prediction on a single test image (`test/test/TomatoHealthy4.JPG`).

**Prediction Output for `TomatoHealthy4.JPG`:**

* **Prediction Array:** The highest probability is at index 37 (approximately 99.9989%).
* **Predicted Index:** `37`
* **Predicted Class Name:** `Tomato___healthy`

This confirms that the model correctly predicts the image as a **healthy tomato leaf**.

### Flask API (`app.py`)

The `app.py` file sets up a web server to handle image uploads and return structured JSON predictions.

#### Startup

To run the API, execute the following command in your terminal:

```bash
python app.py
The application will start on http://127.0.0.1:5000/.

API Endpoint
Endpoint: /api/predict

Method: POST

Request: A multipart/form-data request with an image file under the key image.

Response (JSON):

JSON

{
  "prediction": {
    "disease_name": "Tomato - healthy",
    "confidence": 0.9999891523999999,
    "description": "No description available.",
    "remedies": [],
    "prevention": [],
    "symptoms": []
  }
}
5. Disease Information (crop_disease_info.md)
This file is crucial for providing human-readable context for the predictions. It contains structured information for all 38 disease and healthy classes.

Example Structure (Conceptual)
The app.py file includes logic (load_disease_info_from_markdown) to parse custom sections from this markdown file, which is an excellent way to integrate domain-specific knowledge with the ML model's output.

Markdown

Apple Scab
Definition: [Description of Apple Scab]
Symptoms: [Symptom 1]||[Symptom 2]||...
Precautions: [Prevention 1]||[Prevention 2]||...
Treatment and Remedies: [Remedy 1]||[Remedy 2]||...

Apple Black Rot
Definition: [Description of Apple Black Rot]
...
