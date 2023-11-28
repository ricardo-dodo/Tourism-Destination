from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load the model
model = tf.keras.models.load_model('tourism_recommendation_model.h5')

# Load your places data
places_df = pd.read_csv('tourism_with_id.csv')

# Assuming you have a DataFrame with user ratings
# Replace 'path_to_your_ratings_data.csv' with the path to your ratings data
ratings_df = pd.read_csv('tourism_rating.csv')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    user_id = int(request.form['user_id'])
    recommendations = generate_recommendations(user_id)
    return render_template('index.html', recommendations=recommendations)

def generate_recommendations(user_id):
    # Filter places that the user has not rated
    rated_places = ratings_df[ratings_df['User_Id'] == user_id]['Place_Id'].unique()
    unrated_places = places_df[~places_df['Place_Id'].isin(rated_places)]

    # Predict ratings for the unrated places
    user_data = np.array([user_id] * len(unrated_places))
    place_data = unrated_places['Place_Id'].values
    predictions = model.predict([user_data, place_data])
    predicted_ratings = predictions.flatten()

    # Sort the unrated places based on the predicted ratings
    unrated_places['Predicted_Rating'] = predicted_ratings
    top_places = unrated_places.sort_values(by='Predicted_Rating', ascending=False).head(5)

    # Get the names of the top-rated places
    top_place_names = top_places['Place_Name'].tolist()
    return top_place_names

if __name__ == '__main__':
    app.run(debug=True)
