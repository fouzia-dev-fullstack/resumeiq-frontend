import React, { useState } from 'react';
import './App.css';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please fill in both fields!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://resumeiq-backend-production-95c8.up.railway.app/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Something went wrong! Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="hero">
        <h1>ResumeIQ</h1>
        <p>AI-Powered ATS Resume Analyzer</p>
      </div>

      <div className="container">
        <div className="input-section">
          <div className="input-box">
            <label>Paste Your Resume</label>
            <textarea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
            />
          </div>

          <div className="input-box">
            <label>Job Description</label>
            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        {analysis && (
          <div className="results">
            <div className="score-card">
              <div className="score-circle">
                <span className="score-number">{analysis.matchScore}%</span>
                <span className="score-label">ATS Match</span>
              </div>
            </div>

            <div className="cards-grid">
              <div className="card strong">
                <h3>Strong Points</h3>
                <div className="chips">
                  {analysis.strongPoints.map((point, i) => (
                    <span key={i} className="chip green">{point}</span>
                  ))}
                </div>
              </div>

              <div className="card missing">
                <h3>Missing Keywords</h3>
                <div className="chips">
                  {analysis.missingKeywords.map((keyword, i) => (
                    <span key={i} className="chip red">{keyword}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card suggestions">
              <h3>Suggestions</h3>
              <ul>
                {analysis.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;