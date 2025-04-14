from flask import Flask, request, jsonify
from joblib import load
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
model = load("wellness_model.joblib")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # User input from React Native
    
    # Convert input to DataFrame (same features as training)
    input_data = pd.DataFrame([{
        "Sleep Duration (hrs)": data["sleep_duration"],
        "Sleep Quality (1-5)": data["sleep_quality"],
        "Exercise Duration (mins)": data["exercise_duration"],
        "Exercise_Type": data["exercise_type"],
        "Water Intake (glasses)": data["water_intake"],
        "Pain Level (0-10)": data["pain_level"],
        "Stress Level (1-10)": data["stress_level"],
        "Mood": data["mood"]
    }])
    
    # Predict wellness score (0-10 scale)
    wellness_score = model.predict(input_data)[0]
    
    # Return score + suggestions
    return jsonify({
        "wellness_score": round(wellness_score * 10, 1),  # Scale to 0-100
        "message": get_feedback(wellness_score)
    })

def get_feedback(score):
    if score < 4:
        return "Prioritize rest and hydration. Try light stretching."
    elif score < 7:
        return "Doing okay! Aim for 7+ hrs of sleep."
    else:
        return "Great job! Keep up the good habits."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)