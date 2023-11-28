# Tourism Destination Recommendation System Indonesia

## Project Overview
This project aims to develop a tourism destination recommendation system using machine learning. It leverages user preferences and historical travel data to suggest personalized travel destinations. The system is built using Python, with TensorFlow employed for machine learning and Flask for creating a web-based interface.

## Features
- **Data-Driven Recommendations**: Utilizes user ratings and travel history to generate personalized destination suggestions.
- **Machine Learning Model**: Implements a collaborative filtering approach using TensorFlow to predict user preferences.
- **Interactive Web Interface**: A Flask-based frontend where users can enter their IDs and receive tailored travel recommendations.
- **Dataset Integration**: Incorporates publicly available tourism datasets, including destination details and user ratings.

## Technologies Used
- **Python**: Primary programming language for data processing and machine learning.
- **TensorFlow**: Used for building and training the recommendation engine.
- **Flask**: Creates a web interface for users to interact with the model.
- **Pandas**: For data manipulation and analysis.
- **HTML/CSS**: For frontend design and layout.

## How It Works
1. **Data Processing**: The system preprocesses the tourism data to format and clean it for machine learning.
2. **Model Training**: A collaborative filtering model is trained using historical user data and their ratings of various tourism destinations.
3. **Recommendation Generation**: The model predicts user preferences for unrated destinations and ranks them.
4. **User Interface**: Users can input their unique ID into the web interface to receive a list of recommended destinations.

## Installation and Usage
- Install dependencies: `pip install -r requirements.txt`.
- Run the Flask app: `python3 app.py`.
- Access the web interface via `http://localhost:5000`.

## Contributing
Contributions to enhance or extend the project's functionality are welcome. Please feel free to fork the repository and submit pull requests.

## License
[MIT License](LICENSE)

## Contact
For any queries or feedback regarding this project, please contact [ricardo.3bdg@gmail.com].
