import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DigitalTwinAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [personalityType, setPersonalityType] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [digitalTwinName, setDigitalTwinName] = useState('');
  const [gender, setGender] = useState('');
  const [interests, setInterests] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const navigate = useNavigate();


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

  const saveFileMetaData = ()=> {
  const userId = sessionStorage.getItem('userId');

    // Create file in Google Drive
    const fileMetadata = {
    };

    // Add user ID to file metadata or description
    fileMetadata.description = JSON.stringify({
      userId: userId,
    });
    return fileMetadata;
  };
  const saveToGoogleDrive = async (content) => {
    try {
      const fileMetadata = saveFileMetaData();
      console.log('content:', content);
      console.log('fileMetadata:', fileMetadata);
      let stringContent;
      try {
        stringContent = await convertBlobToString(content);
        console.log('Converted string:', stringContent); // This will log the string content

        // Now you can use stringContent for further processing
      } catch (error) {
        console.error('Error converting blob to string:', error);
      }

      const response = await axios.post('http://localhost:3001/api/upload-to-drive', {
      stringContent: stringContent,
      fileDescription: fileMetadata});
      console.log('File Id:', response.data.fileId);
      return response.data.fileId;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const convertBlobToString = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // This will be the string content
      };
      reader.onerror = reject; // Handle error
      reader.readAsText(blob); // Read the Blob as text
    });
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
      personalityDescription = ` ${traits.join(', ')}`;
    }

    const analysisText = `
      <p>Name : ${digitalTwinName}</p>
      <p>Age : ${age}</p>
      <p>Gender : ${gender}</p>
      <p>MBTI Personality : ${personalityDescription}</p>
      <p>Values :</p>
      <ul>
        ${selectedValues.map(value => `<li>${value}</li>`).join(',')}
      </ul>
      <p>Interests : ${interests}</p>
      <p>Country : ${country}</p>
      <p>Journal : ${additionalInfo}</p>
      <p>AI can enhance your decision-making process by:</p>
      <ul>
        <li>Discover the perfect product with AI-driven recommendations tailored to your personality, values, and interests, eg., find a Christmas Sweater</li>
        <li>Offering alternative perspectives that align with your personality </li>
        <li>Helping you recognize and mitigate potential biases</li>
        <li>Supporting structured decision frameworks that match your thinking style</li>
      </ul>
    `;

    setAnalysis(analysisText);
    setShowResult(true);
  };

  const downloadReport = () => {
    const reportContent = `
      Personality Type: ${personalityType}
      Core Values: ${selectedValues.join(', ')}
      Decision-Making Style Analysis:
      ${analysis.replace(/<[^>]+>/g, '')}
      Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const fileId = saveToGoogleDrive(blob);
    console.log('Report saved to Google Drive, File ID:', fileId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personality-values-report.txt';
    a.click();
    handleDownload();
  };
  const handleDownload = () => {
    navigate('/chatbot');
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
          <p className="mb-4">Take the 16 Personalities test to discover your personality type. This will help us understand your natural decision-making preferences.</p>
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
          <h2>Step 3: Provide Additional Information</h2>
          <div className="form-group">
            <label htmlFor="digitalTwinName" className="form-label">Digital Twin Name:</label>
            <input
              type="text"
              id="digitalTwinName"
              className="form-input"
              value={digitalTwinName}
              onChange={(e) => setDigitalTwinName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="interests" className="form-label">Interests:</label>
            <input
              type="text"
              id="interests"
              className="form-input"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age" className="form-label">Age:</label>
            <input
              type="text"
              id="age"
              className="form-input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age" className="form-label">Gender:</label>
            <input
              type="text"
              id="age"
              className="form-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country" className="form-label">Country:</label>
            <input
              type="text"
              id="country"
              className="form-input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="additionalInfo" className="form-label">Additional Info:</label>
            <textarea
              id="additionalInfo"
              className="form-textarea"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            ></textarea>
          </div>
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

export default DigitalTwinAssessment;
