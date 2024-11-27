from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)

# Enable CORS for all domains (or specify a list of allowed domains)
CORS(app)

# Load the trained model
model_path = "best_pest_detection_model.keras"  # Update if your model filename is different
model = load_model(model_path)

# Define pest classes and pest management suggestions
pest_classes = ['aphids', 'armyworm', 'bollworm', 'mites']
pest_management = {
    'aphids': {
        'lifecycle': "35-45 days after sowing",
        'control': ["Imidacloprid", "Acephate"]
    },
    'armyworm': {
        'lifecycle': "50-60 days after sowing",
        'control': ["Emamectin Benzoate 5 SG @ 0.4 g/l", "Chlorantraniliprole"]
    },
    'bollworm': {
        'lifecycle': "80-90 days after sowing",
        'control': ["Profenofos + Cypermethrin", "Chlorantraniliprole + Lambda-cyhalothrin"]
    },
    'mites': {
        'lifecycle': "45-55 days after sowing",
        'control': ["Fipronil", "Diafenthiuron", "Beta-cyfluthrin + Imidacloprid"]
    }
}

@app.route('/')
def home():
    """
    Home route for the API.
    """
    return "Welcome to the Pest Detection API! Use the `/predict` endpoint to upload an image and detect pests."

@app.route('/favicon.ico')
def favicon():
    """
    Handle favicon requests.
    """
    return '', 204

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict endpoint for pest detection.
    Accepts an image file and returns the predicted pest and control measures.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded. Please upload an image.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected. Please upload an image.'}), 400

    try:
        # Save the file temporarily
        temp_path = "temp_image.jpg"
        file.save(temp_path)

        # Preprocess the image
        img = image.load_img(temp_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        # Predict the pest
        predictions = model.predict(img_array)
        class_idx = np.argmax(predictions, axis=1)[0]
        predicted_pest = pest_classes[class_idx]

        # Fetch pest-specific information
        lifecycle = pest_management[predicted_pest]['lifecycle']
        control = pest_management[predicted_pest]['control']

        # Clean up temporary file
        os.remove(temp_path)

        # Return the prediction and control measures
        return jsonify({
            'pest': predicted_pest,
            'lifecycle': lifecycle,
            'control_measures': ', '.join(control)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
