import { MessageSquare, Shield, Sparkles, TrendingUp } from 'lucide-react';
import type React from 'react';

export const VizierIntroduction: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 xl:p-12 flex-col text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-400 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        </div>
        <span className="text-xl font-semibold">Vizier</span>
      </div>

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10 max-w-xl">
        {/* Hero section */}
        <div className="space-y-6 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm text-blue-200">
            <Sparkles className="w-4 h-4" />
            <span>AI-powered healthcare analytics</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Your data has answers.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              Just ask.
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed">
            Vizier turns complex healthcare data into clear insights. Ask
            questions in plain English—no SQL, no training required.
          </p>
        </div>

        {/* Mock conversation preview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 mb-10">
          <div className="space-y-4">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-blue-500/20 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                <p className="text-sm text-blue-100">
                  What are my top 5 diagnoses this quarter?
                </p>
              </div>
            </div>

            {/* Vizier response */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">V</span>
              </div>
              <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-3 flex-1">
                <p className="text-sm text-slate-200 mb-3">
                  Here are your top diagnoses for Q4:
                </p>
                <div className="space-y-2">
                  {[
                    { name: 'Essential Hypertension', code: 'I10', pct: 23 },
                    { name: 'Type 2 Diabetes', code: 'E11.9', pct: 18 },
                    { name: 'Hyperlipidemia', code: 'E78.5', pct: 14 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300">{item.name}</span>
                          <span className="text-slate-400">{item.code}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"
                            style={{ width: `${item.pct * 3}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 w-8">
                        {item.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: MessageSquare, label: 'Natural language queries' },
            { icon: TrendingUp, label: 'Real-time insights' },
            { icon: Shield, label: 'HIPAA compliant' },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
            >
              <Icon className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom social proof */}
      <div className="relative z-10 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                'bg-blue-500',
                'bg-teal-500',
                'bg-purple-500',
                'bg-amber-500',
              ].map((color, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${color} border-2 border-slate-900 flex items-center justify-center text-xs font-medium`}
                >
                  {['JD', 'SM', 'AR', 'KL'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                50+ healthcare teams
              </p>
              <p className="text-xs text-slate-400">
                trust Vizier with their data
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>SOC 2 Type II certified</p>
            <p>Enterprise-ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VizierIntroduction;
