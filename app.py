from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load your places data
places_df = pd.read_csv('public/tourism_with_id.csv')

# Load ratings data
ratings_df = pd.read_csv('public/tourism_rating.csv')

# Create a pivot table: places as rows, users as columns, ratings as values
# Use aggfunc='mean' to handle duplicate entries
pivot_table = ratings_df.pivot_table(index='Place_Id', columns='User_Id', values='Place_Ratings', aggfunc='mean').fillna(0)

# Calculate cosine similarity between places
similarity_matrix = cosine_similarity(pivot_table)

@app.route('/recommend', methods=['POST'])
def recommend():
    place_id = int(request.json['place_id'])
    recommendations = generate_recommendations(place_id)
    return jsonify(recommendations)

def generate_recommendations(place_id):
    place_index = pivot_table.index.get_loc(place_id)
    similarity_scores = list(enumerate(similarity_matrix[place_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_similar_places = similarity_scores[1:6]
    
    recommendations = []
    for i, score in top_similar_places:
        place_id = pivot_table.index[i]
        place_info = places_df.loc[places_df['Place_Id'] == place_id].iloc[0]
        recommendations.append({
            'Place_Id': int(place_id),
            'Place_Name': place_info['Place_Name'],
            'Category': place_info['Category'],
            'Price': float(place_info['Price']),
            'Similarity_Score': float(score)
        })
    
    return recommendations

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)