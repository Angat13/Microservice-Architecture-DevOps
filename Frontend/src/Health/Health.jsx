import React, { useState } from 'react';
import axios from 'axios';
import './Health.css';

const options = [
  "Veg", "Non-Veg", "Vegan",
  "Diabetic", "Gluten-Free", "Low BP",
  "High BP", "Jaundice", "Cancer",
  "Fever", "Cold", "Thyroid",
  "PCOS", "Pregnancy Safe", "Heart Patient",
  "Keto", "Lactose Intolerant", "Weight Loss",
  "Weight Gain", "Cholesterol Control", "Renal Diet"
];

const HealthFoodSuggest = () => {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    setSelected(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5002/api/health-food", {
        preferences: selected
      });
      setResult(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="health-container">
      <h2 className="health-title">Select Health/Diet Preferences</h2>
      <div className="health-options">
        {options.map((opt) => (
          <label key={opt} className="health-label">
            <input
              type="checkbox"
              value={opt}
              onChange={handleChange}
              className="health-checkbox"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="health-btn"
      >
        Suggest Foods
      </button>

      {result && (
        <div className="health-result">
          {result.available ? (
            <div>
              <h3 className="health-result-title">Available Options:</h3>
              <ul className="health-result-list">
                {result.available.map((item, index) => (
                  <li key={index}>{item.name} - ₹{item.price}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="health-result-message">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthFoodSuggest;
