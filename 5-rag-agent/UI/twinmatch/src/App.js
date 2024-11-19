// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DigitalTwinAssessment from './components/DigitalTwinAssessment';
import { useState } from 'react';
import { useEffect} from 'react';
import './index.css'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // New Chatbot Component
const ChatbotPage = () => {
  useEffect(() => {
    try {
      const userId = sessionStorage.getItem('userId');
      console.log('userid-chatbot',userId);
      const { createChat } = require('@n8n/chat');
      createChat({
        webhookUrl: 'http://localhost:5678/webhook/0133dcca-e8e0-4bf8-be8c-79a8f8a68304/chat',
        webhookConfig: {
          method: 'POST',
          headers: {userId}
        },
        target: '#n8n-chat',
        mode: 'fullscreen',
        chatInputKey: 'chatInput',
        chatSessionKey: 'sessionId',
        metadata: {},
        showWelcomeScreen: false,
        defaultLanguage: 'en',
        initialMessages: [
          'User once asked his twin.. 👋',
          'Find a Christmas Sweater'
        ],
        i18n: {
          en: {
            title: 'Hey there, I am your Digital Twin..',
            subtitle: 'Please wait for a few minutes while I get ready to start matching',
            footer: '',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your question..',
          },
        },
      });
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* The chat widget will be injected here by @n8n/chat */}
    </div>
  );
};

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <DigitalTwinAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
