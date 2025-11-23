import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { processQuery, QueryResult } from '../services/query-orchestrator';

export function QueryInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const queryResult = await processQuery(query);
      setResult(queryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your regulatory compliance query..."
            className="w-full h-32 px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
          <Search className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing Query...' : 'Analyze Query'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
}

function ResultDisplay({ result }: { result: QueryResult }) {
  const outcomeConfig = {
    'Eligible': {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    'Not Eligible': {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      icon: AlertTriangle,
      iconColor: 'text-red-600'
    },
    'Requires More Data': {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-900',
      icon: Info,
      iconColor: 'text-amber-600'
    }
  };

  const config = outcomeConfig[result.outcome];
  const Icon = config.icon;

  const lines = result.displayText.split('\n\n');
  const conclusion = lines[0];
  const interpretation = lines[1];
  const legalBasis = lines.slice(2).join('\n\n');

  return (
    <div className="space-y-6">
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6`}>
        <div className="flex items-start space-x-3 mb-4">
          <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-1`} />
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${config.textColor}`}>
              {conclusion.replace(/\*\*/g, '').replace('DETERMINATION: ', '')}
            </h2>
          </div>
        </div>

        <p className={`${config.textColor} text-base leading-relaxed`}>
          {interpretation}
        </p>
      </div>

      {result.biasDetected && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900">Compliance Notice</h3>
            <p className="text-amber-700 text-sm mt-1">
              This determination has been flagged for compliance review due to the presence of protected characteristics in the source material.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(legalBasis) }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 px-2">
        <span>Query ID: {result.queryId}</span>
        <span>Processing Time: {result.processingTimeMs}ms</span>
        <span>Conflict Score: {result.conflictScore}/10</span>
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  let html = text;

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');

  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}
