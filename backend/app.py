import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import numpy as np
from PIL import Image
import base64

from detector import LicensePlateDetector

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

detector = LicensePlateDetector()

@app.route('/detect', methods=['POST'])
def detect_license_plate():
    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    # Read image
    img = Image.open(io.BytesIO(file.read()))
    img_np = np.array(img)
    
    # Convert RGB to BGR (OpenCV uses BGR)
    img_np = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    
    # Detect plates
    detected_plates = detector.detect_plates(img_np)
    
    # Process detected plates
    results = []
    for plate in detected_plates:
        # Crop plate region
        x, y, w, h = plate['region']
        plate_img = img_np[y:y+h, x:x+w]
        
        # Recognize plate text
        plate_text = detector.recognize_plate(plate_img)
        
        results.append({
            'text': plate_text,
            'plate_image': plate['plate_image']
        })
    
    # Encode result image to base64
    _, buffer = cv2.imencode('.jpg', img_np)
    result_image_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        'results': results,
        'result_image': result_image_base64
    })

if __name__ == '__main__':
    app.run(debug=True)