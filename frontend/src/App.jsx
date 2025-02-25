import { useState } from "react";
import "./App.css";

// local images
import posImg from "./assets/positive.png";
import neuImg from "./assets/neutral.png";
import negImg from "./assets/negative.png";

function App() {
  const [postLink, setPostLink] = useState("");

  // State to store confidence scores
  const [posCon, setPosConfidence] = useState(0);
  const [neuCon, setNeuConfidence] = useState(0);
  const [negCon, setNegConfidence] = useState(0);

  return (
    <div className="app-container">
      
      <div className="left-column">
        <div>
          <h2 className="text-header">Reddit Sentiment Analyzer</h2>
          <div  className="left-top-cont">
            <input
              type="text"
              placeholder="Reddit Link Post..."
              className="input-text"
            />
            <button className="button">
              SUBMIT
            </button>
          </div>
        </div>
        
          <textarea
            readOnly
            className="text-view"
            placeholder="Analyzed text..."
          />
      </div>

      <div className="right-column">
        <div>
          <div className="bot-container">
            <img className="confidence-image" src={posImg} alt="Positve"/>
            <div className="confidence-bar">
              <div className="confidence-fill pos" style={{ width: `${posCon}%` }}></div>
            </div>
          </div>

          <div className="bot-container">
            <img className="confidence-image" src={neuImg} alt="Neutral"/>
            <div className="confidence-bar">
              <div className="confidence-fill neu" style={{ width: `${neuCon}%` }}></div>
            </div>
          </div>

          <div className="bot-container">
            <img className="confidence-image" src={negImg} alt="Negative"/>  
            <div className="confidence-bar">
              <div className="confidence-fill neg" style={{ width: `${negCon}%` }}></div>
            </div>
          </div>
        </div>

        <div className="ai-text-container">
            <h3 className="ai-text">AI GENERATED PERCENTAGE: </h3>
            <textarea
              className="ai-percentage"
            />
        </div>
      </div>
    </div>
  );
}

export default App;
