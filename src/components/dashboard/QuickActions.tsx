import { Bell, Lightbulb, Upload } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdviseModal } from './AdviseModal';
import { AlertModal } from './AlertModal';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showAdviseModal, setShowAdviseModal] = useState(false);

  return (
    <>
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Upload Data */}
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-white transition-all text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Upload Data</h4>
            <p className="text-sm text-gray-400">Add new healthcare data</p>
          </button>

          {/* Ask Vizier */}
          <button
            type="button"
            onClick={() => navigate('/insights')}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-white transition-all text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="/images/vizier-avatar.png"
                alt="Ask Vizier"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-white font-semibold mb-2">Ask Vizier</h4>
            <p className="text-sm text-gray-400">
              Get instant insights from your data
            </p>
          </button>

          {/* Alert Me When */}
          <button
            type="button"
            onClick={() => setShowAlertModal(true)}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-white transition-all text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Alert Me When</h4>
            <p className="text-sm text-gray-400">Set up conditional alerts</p>
          </button>

          {/* Advise! */}
          <button
            type="button"
            onClick={() => setShowAdviseModal(true)}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-white transition-all text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2">Advise!</h4>
            <p className="text-sm text-gray-400">
              Suggest features or improvements
            </p>
          </button>
        </div>
      </div>

      {/* Modals */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />
      <AdviseModal
        isOpen={showAdviseModal}
        onClose={() => setShowAdviseModal(false)}
      />
    </>
  );
};

export default QuickActions;
