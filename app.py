from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load the model
model = tf.keras.models.load_model('tourism_recommendation_model.h5')

# Load your places data
places_df = pd.read_csv('tourism_with_id.csv')

# Assuming you have a DataFrame with user ratings
# Replace 'path_to_your_ratings_data.csv' with the path to your ratings data
ratings_df = pd.read_csv('tourism_rating.csv')


@app.route('/recommend', methods=['POST'])
def recommend():
    place_id = int(request.json['place_id'])
    recommendations = generate_recommendations(place_id)
    return jsonify(recommendations)

def generate_recommendations(place_id):
    # Create a pivot table: places as rows, users as columns, ratings as values
    pivot_table = ratings_df.pivot(index='Place_Id', columns='User_Id', values='Place_Ratings').fillna(0)
    
    # Calculate cosine similarity between places
    similarity_matrix = cosine_similarity(pivot_table)
    
    # Get the index of the input place_id
    place_index = pivot_table.index.get_loc(place_id)
    
    # Get similarity scores for the input place
    similarity_scores = list(enumerate(similarity_matrix[place_index]))
    
    # Sort places based on similarity scores
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    
    # Get top 5 similar places (excluding the input place itself)
    top_similar_places = similarity_scores[1:6]
    
    # Get the names of the top similar places
    top_place_names = [places_df.loc[places_df['Place_Id'] == pivot_table.index[i], 'Place_Name'].values[0] for i, _ in top_similar_places]
    
    return top_place_names

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)