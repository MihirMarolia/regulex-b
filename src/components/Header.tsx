import { Scale } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ReguLex AI</h1>
            <p className="text-sm text-gray-600">G7 Regulatory Compliance Assistant</p>
          </div>
        </div>
      </div>
    </header>
  );
}
