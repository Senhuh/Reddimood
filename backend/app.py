from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import requests
from langdetect import detect
import numpy as np

app = Flask(__name__)
CORS(app)

# Models
ai_model = joblib.load("model/ai_detection_pipeline3-final.pkl")
sentiment_model = joblib.load("model/sentiment_model.pkl")
sentiment_vectorizer = joblib.load("model/sentiment_vectorizer.pkl")  

@app.route("/fetch_reddit_text", methods=["POST"])
def fetch_reddit_text():
    """Fetch text from a Reddit post URL."""
    data = request.json
    url = data.get("url", "")

    if not url.startswith("https://www.reddit.com/r/"):
        # REDDIT ONLY
        return jsonify({"error": "Hey there! I currently only process Reddit posts."}), 400

    json_url = url + ".json"
    headers = {"User-Agent": "Reddit Sentiment Analyzer Bot"}

    try:
        response = requests.get(json_url, headers=headers)
        response.raise_for_status()
        reddit_data = response.json()

        #  WORDS ONLY
        post = reddit_data[0]["data"]["children"][0]["data"]
        text = post.get("selftext", "").strip()

        if not text:
            return jsonify({"error": "This Reddit post has no text content, so I can't analyze it."}), 400

        #  ENGLISH ONLY
        if detect(text) != "en":
            return jsonify({"error": "Hey there! I detected that the post is not in English. I currently only process English posts from Reddit!"}), 400

        return jsonify({"text": text})

    except Exception as e:
        return jsonify({"error": f"Failed to fetch Reddit post: {str(e)}"}), 500

@app.route("/predict", methods=["POST"])
def predict():
    """Process AI detection and sentiment analysis."""
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # AI Detection 
    ai_probabilities = ai_model.predict_proba([text])[0]

    # check if AI probability is greater than 20%
    if ai_probabilities[1] > 0.2:
        return jsonify({"error": "Hey there! I detected that the post has an AI probability greater than 20%! I’m currently limited to human post"}), 400

    ai_response = {
        "human": round(float(ai_probabilities[0]) * 100, 2),
        "ai": round(float(ai_probabilities[1]) * 100, 2),
    }

    # Transform text into TF-IDF before sentiment prediction
    text_transformed = sentiment_vectorizer.transform([text])  # it needs a 2d array input

    # Sentiment Model prediction
    sentiment_probabilities = sentiment_model.predict_proba(text_transformed)[0]

    sentiment_response = {
        "positive": round(float(sentiment_probabilities[0]) * 100, 2),
        "neutral": round(float(sentiment_probabilities[1]) * 100, 2),
        "negative": round(float(sentiment_probabilities[2]) * 100, 2),
    }

    response = {
        "ai_detection": ai_response,
        "sentiment": sentiment_response
    }

    print("Response Sent:", response)  # Debugggg
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
