import { useState } from "react";
import "./App.css";

import posImg from "./assets/positive.png";
import neuImg from "./assets/neutral.png";
import negImg from "./assets/negative.png";

function App() {
  const [postLink, setPostLink] = useState(""); // Stores Reddit post link
  const [loading, setLoading] = useState(false); // Shows loading state

  // State for AI Deetection
  const [humanCon, setHumanConfidence] = useState(0);
  const [aiCon, setAiConfidence] = useState(0);

  //  State for Sentiment Analysis
  const [posCon, setPosConfidence] = useState(0);
  const [neuCon, setNeuConfidence] = useState(0);
  const [negCon, setNegConfidence] = useState(0);

  // State for API errors
  const [error, setError] = useState(null);
  const [analyzedText, setAnalyzedText] = useState(""); // Extracted Reddit text

  const handleSubmit = async () => {
    if (!postLink.trim() || !postLink.startsWith("https://www.reddit.com/r/")) {
      alert("Hey there! I currently only process Reddit posts.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      //  Fetch Reddit post content
      const redditResponse = await fetch("http://127.0.0.1:5000/fetch_reddit_text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: postLink }),
      });

      const redditData = await redditResponse.json();

      if (!redditResponse.ok) {
        alert(redditData.error || "Failed to fetch Reddit post content.");
        setLoading(false);
        return;
      }

      const extractedText = redditData.text;
      setAnalyzedText(extractedText);

      // Send extracted text to backend for AI detection + Sentiment
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: extractedText }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setHumanConfidence(data.ai_detection.human);
        setAiConfidence(data.ai_detection.ai);

        // Update Sentiment Scores
        setPosConfidence(data.sentiment.positive);
        setNeuConfidence(data.sentiment.neutral);
        setNegConfidence(data.sentiment.negative);
      } else {
        alert(data.error || "Error processing request.");
      }
    } catch (err) {
      alert("Failed to connect to the backend.");
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <h2 className="text-header">Reddit Sentiment & AI Detector</h2>
        <div className="left-top-cont">
          <input
            type="text"
            placeholder="Enter Reddit Post Link..."
            className="input-text"
            value={postLink}
            onChange={(e) => setPostLink(e.target.value)}
          />
          <button className="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "SUBMIT"}
          </button>
        </div>
        {error && <p className="error-text">{error}</p>}
        
        <textarea
          readOnly
          className="text-view"
          placeholder="Analyzed text..."
          value={analyzedText}
        />
      </div>

      {/* Right Column /}
      {/* AI Detection Results */}
      <div className="right-column">
        <div className="ai-text-container">
          <h3 className="ai-text">AI GENERATED PERCENTAGE:</h3>
          <div className="ai-percentage">
            <span>Human: {humanCon}% | AI: {aiCon}%</span>
          </div>
        </div>

        {/* Sentiment Analysis Results */}
        <div>
          <div className="bot-container">
            <img className="confidence-image" src={posImg} alt="Positive" />
            <div className="confidence-bar">
              <div className="confidence-fill pos" style={{ width: `${posCon}%` }}></div>
            </div>
          </div>

          <div className="bot-container">
            <img className="confidence-image" src={neuImg} alt="Neutral" />
            <div className="confidence-bar">
              <div className="confidence-fill neu" style={{ width: `${neuCon}%` }}></div>
            </div>
          </div>

          <div className="bot-container">
            <img className="confidence-image" src={negImg} alt="Negative" />
            <div className="confidence-bar">
              <div className="confidence-fill neg" style={{ width: `${negCon}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
