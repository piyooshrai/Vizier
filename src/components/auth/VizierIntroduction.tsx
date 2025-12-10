import React from 'react';
import { MessageSquare, BarChart3, Zap } from 'lucide-react';

export const VizierIntroduction: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-12 flex-col justify-between text-white">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </div>
        <span className="text-2xl font-bold">Vizier</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center space-y-8">
        {/* Avatar and introduction */}
        <div className="space-y-6">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
            <img
              src="/vizier-avatar.svg"
              alt="Vizier AI Assistant"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to styled placeholder if image fails to load
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
                    <defs>
                      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#60A5FA"/>
                        <stop offset="100%" style="stop-color:#3B82F6"/>
                      </linearGradient>
                    </defs>
                    <rect width="128" height="128" fill="url(#bg)"/>
                    <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle" dy=".35em">V</text>
                  </svg>
                `);
              }}
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight">
              Hi, I'm Vizier
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-md">
              I help healthcare teams turn data into decisions. Ask me anything about your patients,
              encounters, or outcomes—in plain English.
            </p>
          </div>
        </div>

        {/* What I can do */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Conversational</h3>
              <p className="text-blue-100 text-sm">
                "What are my top diagnoses?" No SQL, no complexity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Instant insights</h3>
              <p className="text-blue-100 text-sm">
                Beautiful charts with context you can share with your team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Healthcare-native</h3>
              <p className="text-blue-100 text-sm">
                I understand ICD-10, CPT codes, and clinical workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div className="space-y-2">
        <p className="text-sm text-blue-100">
          Trusted by healthcare teams at 50+ organizations
        </p>
        <p className="text-xs text-blue-200">
          HIPAA compliant • SOC 2 Type II • Enterprise-ready
        </p>
      </div>
    </div>
  );
};

export default VizierIntroduction;
