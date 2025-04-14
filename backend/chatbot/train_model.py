import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from joblib import dump

# Load dataset
df = pd.read_csv("cleaned_mom_health_tracking.csv")  # Your dataset

# Feature Engineering
# Convert categorical variables (e.g., Mood, Exercise Type) to numerical
df["Mood"] = df["Mood / Emotional State"].map({"Sad": 0, "Neutral": 1, "Happy": 2, "Irritated": -1})
df["Exercise_Type"] = df["Exercise Type"].map({"None": 0, "Stretching": 1, "Walk": 2})

# Define features (X) and target (y)
features = [
    "Sleep Duration (hrs)", "Sleep Quality (1-5)", "Exercise Duration (mins)", 
    "Exercise_Type", "Water Intake (glasses)", "Pain Level (0-10)", 
    "Stress Level (1-10)", "Mood"
]
X = df[features]
y = df["Energy Morning (0-10)"] * 0.3 + df["Energy Afternoon (0-10)"] * 0.4 + df["Energy Night (0-10)"] * 0.3  # Example wellness score (0-10 scale)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
dump(model, "wellness_model.joblib")
print("Model trained and saved!")