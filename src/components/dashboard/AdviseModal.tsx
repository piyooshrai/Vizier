import { CheckCircle, Lightbulb, Send, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface AdviseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOptions = [
  {
    value: 'feature_request',
    label: 'Feature Request',
    description: 'Suggest a new feature',
  },
  {
    value: 'improvement',
    label: 'Improvement Suggestion',
    description: 'Make something better',
  },
  { value: 'bug_report', label: 'Bug Report', description: 'Report an issue' },
  {
    value: 'general_feedback',
    label: 'General Feedback',
    description: 'Share your thoughts',
  },
];

export const AdviseModal: React.FC<AdviseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [category, setCategory] = useState('feature_request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Simulate API call (will be connected to backend later)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save to localStorage for now
    const feedback = {
      id: Date.now().toString(),
      category,
      message,
      timestamp: new Date().toISOString(),
    };

    const existingFeedback = JSON.parse(
      localStorage.getItem('vizier_feedback') || '[]',
    );
    localStorage.setItem(
      'vizier_feedback',
      JSON.stringify([...existingFeedback, feedback]),
    );

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      setCategory('feature_request');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitted(false);
      setMessage('');
      setCategory('feature_request');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-3xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Advise Us!</h2>
              <p className="text-sm text-gray-400">Help us improve Vizier</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-2">
                Thank you for your feedback!
              </p>
              <p className="text-gray-400 text-sm">
                We'll review your suggestion and use it to improve Vizier.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-300 mb-6">
                Your feedback helps us build a better product. Tell us what
                features you'd like to see or what could work better.
              </p>

              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCategory(option.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        category === option.value
                          ? 'border-white bg-white/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <p
                        className={`font-medium text-sm ${
                          category === option.value
                            ? 'text-white'
                            : 'text-gray-300'
                        }`}
                      >
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Suggestion
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What would you like to see in Vizier? Be as specific as possible..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-white placeholder-gray-500"
                  rows={5}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {message.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || isSubmitting}
                className="w-full px-6 py-3 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdviseModal;
