import { Shield, AlertCircle, FileText } from 'lucide-react';

export function InfoPanel() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">How ReguLex AI Works</h3>

      <div className="space-y-4">
        <InfoItem
          icon={FileText}
          title="Context & Retrieval"
          description="Your query is analyzed against our legal knowledge base, focusing on eligibility criteria, definitions, and exceptions."
        />

        <InfoItem
          icon={Shield}
          title="Interpretation & Rationale"
          description="The system performs a step-by-step legal analysis to determine eligibility, flagging any potential bias or conflicts."
        />

        <InfoItem
          icon={AlertCircle}
          title="Compliance Monitoring"
          description="All determinations are logged and monitored for bias detection and quality assurance by compliance officers."
        />
      </div>

      <div className="mt-6 pt-4 border-t border-blue-200">
        <p className="text-xs text-blue-800">
          This system provides guidance based on legal frameworks. For complex cases or final decisions, please consult with a qualified compliance officer.
        </p>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, title, description }: { icon: typeof FileText; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h4 className="font-medium text-blue-900 text-sm">{title}</h4>
        <p className="text-blue-700 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}
