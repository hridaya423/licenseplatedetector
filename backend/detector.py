import cv2
import numpy as np
import easyocr
from paddleocr import PaddleOCR
import base64

class LicensePlateDetector:
    def __init__(self):
        """
        Initialize the license plate detector with pre-trained models
        """
        # Initialize OpenCV's pre-trained cascade classifier for license plates
        self.plate_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_russian_plate_number.xml')
        
        # Initialize OCR readers
        self.paddle_ocr = PaddleOCR(use_angle_cls=True, lang='en')
        self.easy_reader = easyocr.Reader(['en'])

    def detect_plates(self, image_np):
        """
        Detect license plates in the given image numpy array
        
        :param image_np: Numpy array of the image
        :return: List of detected license plate regions
        """
        # Convert to grayscale
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
        
        # Detect plates
        plates = self.plate_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(75, 25)
        )
        
        detected_plates = []
        for (x, y, w, h) in plates:
            # Extract plate region
            plate_img = image_np[y:y+h, x:x+w]
            
            # Encode plate image to base64
            _, buffer = cv2.imencode('.jpg', plate_img)
            plate_base64 = base64.b64encode(buffer).decode('utf-8')
            
            detected_plates.append({
                'region': (x, y, w, h),
                'plate_image': plate_base64
            })
        
        return detected_plates

    def recognize_plate(self, plate_image):
        """
        Recognize text from a license plate image
        
        :param plate_image: Cropped license plate image
        :return: Recognized license plate text
        """
        # Preprocess the image
        gray = cv2.cvtColor(plate_image, cv2.COLOR_BGR2GRAY)
        
        # Try PaddleOCR first
        try:
            paddle_result = self.paddle_ocr.ocr(gray, cls=True)
            if paddle_result and paddle_result[0]:
                # Extract text from the result
                text = ''.join([line[1][0] for line in paddle_result[0] if line[1]])
                return text.replace(' ', '')
        except Exception as e:
            print(f"PaddleOCR failed: {e}")
        
        # Fallback to EasyOCR
        try:
            easy_result = self.easy_reader.readtext(gray)
            if easy_result:
                # Combine detected text, removing spaces
                text = ''.join([result[1] for result in easy_result])
                return text.replace(' ', '')
        except Exception as e:
            print(f"EasyOCR failed: {e}")
        
        return "Unable to recognize plate"