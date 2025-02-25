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

  // trial just to check the bar
  setTimeout(() => {
    setPosConfidence(50);
    setNeuConfidence(25);
    setNegConfidence(30);
  }, 1500);

  return (
    <div className="app-container">
      
      <div className="left-column">
        <div>
          <h1>Reddit Sentiment Analyzer</h1>
          <div>
            <input
              type="text"
              placeholder="Reddit Link Post..."
              className="input-field"
            />
            <button>
              SUBMIT
            </button>
          </div>
        </div>
        
        <textarea
          readOnly
          className="text-view"
        />
      </div>

      <div className="right-column">
        <h1>AI GENERATED PERCENTAGE: </h1>
        <div>

          <div>
            <img src={posImg} alt="Positve"/>
              <div className="confidence-bar">
                <div className="confidence-fill pos" style={{ width: `${posCon}%` }}></div>
              </div>
          </div>

          <div>
            <img src={neuImg} alt="Neutral"/>
            <div className="confidence-bar">
              <div className="confidence-fill neu" style={{ width: `${neuCon}%` }}></div>
            </div>
          </div>

          <div>
            <img src={negImg} alt="Negative"/>  
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
