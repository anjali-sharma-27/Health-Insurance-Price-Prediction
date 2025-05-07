from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the model (make sure it's trained with 6 features)
model = joblib.load('insurance_model.pkl')  # Ensure this path is correct

@app.route('/', methods=['POST'])
def predict_price():
    try:
        data = request.get_json()

        # Ensure the required fields are present
        required_fields = ['age', 'gender', 'bmi', 'children', 'smoker', 'region']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing {field} in request'}), 400

        # Extract the fields from the request body
        age = int(data['age'])
        gender = data['gender']
        bmi = float(data['bmi'])
        children = int(data['children'])
        smoker = data['smoker']
        region = data['region']

        # Validate categorical fields
        gender_mapping = {'male': 0, 'female': 1}
        region_mapping = {'southeast': 0, 'southwest': 1, 'northeast': 2, 'northwest': 3}
        smoker_mapping = {'no': 1, 'yes': 0}

        if gender not in gender_mapping or region not in region_mapping or smoker not in smoker_mapping:
            return jsonify({'error': 'Invalid categorical value'}), 400

        # Prepare input features (6 features)
        features = np.array([
            age,
            gender_mapping[gender],
            bmi,
            children,
            smoker_mapping[smoker],
            region_mapping[region]
        ]).reshape(1, -1)

        # Predict the price using the model
        predicted_price = model.predict(features)[0]

        # Return the predicted price as a JSON response
        return jsonify({'predicted_price': predicted_price})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Prediction failed. Please try again later.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
