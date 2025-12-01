import React, { useState } from 'react';
import clsx from 'clsx';

interface TabsProps {
  activeTab: 'investors' | 'companies';
  onTabChange: (tab: 'investors' | 'companies') => void;
}

function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div className={clsx('border-b border-gray-200', 'mb-8')}>
      <div className={clsx('flex gap-4')}>
        <button
          onClick={() => onTabChange('investors')}
          className={clsx(
            'px-4 py-2',
            'font-medium',
            'border-b-2',
            'transition-colors',
            activeTab === 'investors'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          Investors
        </button>
        <button
          onClick={() => onTabChange('companies')}
          className={clsx(
            'px-4 py-2',
            'font-medium',
            'border-b-2',
            'transition-colors',
            activeTab === 'companies'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          Companies
        </button>
      </div>
    </div>
  );
}

export default Tabs;
