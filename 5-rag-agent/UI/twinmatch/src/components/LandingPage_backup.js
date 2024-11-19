import React, { useState } from 'react';
import { ShoppingBag, Clock, Brain, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const LandingPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful authentication
      console.log('Form submitted:', { email, password });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set authentication state
      setIsAuthenticated(true);

      // Close the modal
      setIsModalOpen(false);

      // Navigate to assessment page
      navigate('/assessment');

    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Digital Twin Shop</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back!' : 'Start your personalized shopping journey'}
          </p>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-800"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </Modal>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Your Personal Shopping Assistant
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create your digital twin and never waste time searching for the perfect product again. Get personalized recommendations based on your personality, values, and preferences.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-indigo-600" />
              <h3 className="text-lg font-semibold">Smart Recommendations</h3>
            </div>
            <p className="text-gray-600">
              Your digital twin understands your preferences and makes intelligent product suggestions that match your style and values.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-indigo-600" />
              <h3 className="text-lg font-semibold">Save Time</h3>
            </div>
            <p className="text-gray-600">
              No more endless scrolling. No more regrets. Get relevant recommendations instantly and make decisions faster.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="text-indigo-600" />
              <h3 className="text-lg font-semibold">Personalized Shopping</h3>
            </div>
            <p className="text-gray-600">
              Experience shopping tailored to your personality type and core values.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                step: 1,
                title: "Create Account",
                description: "Sign up and start your personalized shopping journey"
              },
              {
                step: 2,
                title: "Take Assessment",
                description: "Complete a quick personality and values assessment"
              },
              {
                step: 3,
                title: "Create Digital Twin",
                description: "Your AI shopping assistant is built based on your profile"
              },
              {
                step: 4,
                title: "Get Recommendations",
                description: "Receive personalized product suggestions"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
