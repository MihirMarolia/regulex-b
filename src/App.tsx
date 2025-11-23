import { Header } from './components/Header';
import { QueryInterface } from './components/QueryInterface';
import { InfoPanel } from './components/InfoPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QueryInterface />
          </div>

          <div className="lg:col-span-1">
            <InfoPanel />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            ReguLex AI - Regulatory Compliance Assistant for G7 Public Service
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            All queries are logged for compliance monitoring and quality assurance
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
