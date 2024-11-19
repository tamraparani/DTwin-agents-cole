import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [personalityType, setPersonalityType] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState('');


  const values = [
    "Achievement", "Adventure", "Authority", "Autonomy", "Balance", "Boldness",
    "Compassion", "Creativity", "Curiosity", "Determination", "Fairness", "Faith",
    "Fame", "Family", "Freedom", "Friendship", "Growth", "Happiness", "Harmony",
    "Health", "Honesty", "Honor", "Humor", "Independence", "Innovation",
    "Intelligence", "Justice", "Kindness", "Knowledge", "Leadership", "Learning",
    "Love", "Loyalty", "Mindfulness", "Order", "Peace", "Perseverance", "Power",
    "Recognition", "Respect", "Security", "Self-respect", "Service", "Spirituality",
    "Stability", "Success", "Teamwork", "Tradition", "Truth", "Wisdom"
  ];

  const questions = [
    {
      question: "How do you prefer to recharge?",
      options: [
        "Spending time with others (Extrovert)",
        "Spending time alone (Introvert)"
      ]
    },
    {
      question: "How do you prefer to process information?",
      options: [
        "Through concrete facts and details (Sensing)",
        "Through patterns and impressions (Intuition)"
      ]
    },
    {
      question: "How do you make decisions?",
      options: [
        "Based on logic and consistency (Thinking)",
        "Based on people and circumstances (Feeling)"
      ]
    },
    {
      question: "How do you approach life?",
      options: [
        "In a planned, organized way (Judging)",
        "In a flexible, spontaneous way (Perceiving)"
      ]
    }
  ];

  const handleValueSelection = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < 6) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const answerQuestion = (answer) => {
    setAnswers([...answers, answer]);
    setCurrentQuestion(currentQuestion + 1);
  };




  const generateReport = (e) => {
    e.preventDefault();
    let personalityDescription = '';
    if (personalityType) {
      personalityDescription = `Based on your 16 Personalities result (${personalityType})`;
    } else {
      const traits = [];
      if (answers[0].includes('Extrovert')) traits.push('extroverted');
      if (answers[1].includes('Intuition')) traits.push('intuitive');
      if (answers[2].includes('Thinking')) traits.push('logical');
      if (answers[3].includes('Judging')) traits.push('structured');
      personalityDescription = `Based on your quick assessment, you tend to be ${traits.join(', ')}`;
    }

    const analysisText = `
      <p>${personalityDescription}, your decision-making style is influenced by your core values:</p>
      <ul>
        ${selectedValues.map(value => `<li>${value}</li>`).join('')}
      </ul>
      <p>AI can enhance your decision-making process by:</p>
      <ul>
        <li>Providing data-driven insights while respecting your value system</li>
        <li>Offering alternative perspectives that align with your personality type</li>
        <li>Helping you recognize and mitigate potential biases</li>
        <li>Supporting structured decision frameworks that match your thinking style</li>
      </ul>
    `;

    setAnalysis(analysisText);
    setShowResult(true);
  };

  const downloadReport = () => {
    const reportContent = `
      Personality and Values Analysis Report
      Personality Type: ${personalityType || 'Based on Quick Assessment'}
      Core Values: ${selectedValues.join(', ')}
      Decision-Making Style Analysis:
      ${analysis.replace(/<[^>]+>/g, '')}
      Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    //saveToGoogleDrive(blob);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personality-values-report.txt';
    a.click();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Discover Your Decision-Making Style</h1>
        <p>Understand how your personality and values influence your choices, and learn how AI can enhance your decision-making process.</p>
      </header>

      <div className="container">
        <div className="card">
          <h2>Step 1: Understand Your Personality</h2>
          <p>Take the 16 Personalities test to discover your personality type. This will help us understand your natural decision-making preferences.</p>
          <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer" className="button">Take 16 Personalities Test</a>

          <div className="card" style={{marginTop: '2rem'}}>
            <h3>Quick Personality Assessment</h3>
            <p>Alternatively, take our quick assessment:</p>
            {currentQuestion < questions.length ? (
              <div className="quiz-container active">
                <div className="progress-bar">
                  <div className="progress" style={{width: `${(currentQuestion / questions.length) * 100}%`}}></div>
                </div>
                <h3>{questions[currentQuestion].question}</h3>
                {questions[currentQuestion].options.map((option, index) => (
                  <button key={index} className="button" style={{margin: '0.5rem', display: 'block', width: '100%'}} onClick={() => answerQuestion(option)}>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <h3>Quiz Complete!</h3>
            )}
          </div>
        </div>

        <div className="card">
          <h2>Step 2: Identify Your Core Values</h2>
          <p>Select 5-6 values that resonate most with you:</p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`value${index}`}
                  className="value-checkbox"
                  value={value}
                  checked={selectedValues.includes(value)}
                  onChange={() => handleValueSelection(value)}
                />
                <label htmlFor={`value${index}`} className="value-label">{value}</label>
              </div>
            ))}
          </div>
          <p id="selectedValues">Selected: {selectedValues.length}/6 values</p>
        </div>

        <div className="card">
          <h2>Step 3: Generate Your Report</h2>
          <form onSubmit={generateReport}>
            <div style={{marginBottom: '1rem'}}>
              <label htmlFor="personalityType">Your 16 Personalities Result (if available):</label>
              <input
                type="text"
                id="personalityType"
                style={{width: '100%', padding: '0.5rem', marginTop: '0.5rem'}}
                value={personalityType}
                onChange={(e) => setPersonalityType(e.target.value)}
              />
            </div>
            <button type="submit" className="button">Generate Report</button>
          </form>
        </div>

        {showResult && (
          <div className="card result-section">
            <h2>Your Personal Analysis</h2>
            <div dangerouslySetInnerHTML={{__html: analysis}} />
            <button className="button" onClick={downloadReport}>Download Report</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
