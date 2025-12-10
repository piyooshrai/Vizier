// src/components/chat/TrustBadges.tsx
import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
      <div className="flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        <span>HIPAA Compliant</span>
      </div>
      <div className="flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        <span>SOC 2 Type II</span>
      </div>
      <div className="flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        <span>Enterprise Ready</span>
      </div>
    </div>
  );
};
