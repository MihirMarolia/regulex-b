import { supabase, LegalDocument, Node1Output } from '../lib/supabase';

// G7 Jurisdiction definitions for conflict analysis
const G7_JURISDICTIONS = [
  'Canada',
  'France',
  'Germany',
  'Italy',
  'Japan',
  'United Kingdom',
  'United States',
  'European Union',
];

// Data protection stringency ranking (higher = stricter)
const DATA_PROTECTION_STRINGENCY: Record<string, number> = {
  'European Union': 10,
  'Germany': 10,
  'France': 9,
  'Italy': 9,
  'Japan': 7,
  'United Kingdom': 8,
  'Canada': 7,
  'United States': 5, // State-level varies
};

export async function executeNode1(userQuery: string): Promise<Node1Output> {
  const { data: documents, error } = await supabase
    .from('legal_documents')
    .select('*')
    .in('category', ['Eligibility', 'Definitions', 'Exceptions'])
    .limit(20);

  if (error) {
    throw new Error(`Failed to retrieve legal documents: ${error.message}`);
  }

  if (!documents || documents.length === 0) {
    return {
      TopCitations: [],
      ConflictScore: 0
    };
  }

  const scoredDocuments = documents.map(doc => {
    const relevanceScore = calculateRelevanceScore(userQuery.toLowerCase(), doc);
    return { doc, score: relevanceScore };
  });

  scoredDocuments.sort((a, b) => b.score - a.score);

  const topCitations = scoredDocuments.slice(0, 5).map(({ doc }) => ({
    id: doc.id,
    citation_text: doc.citation_text,
    section_id: doc.section_id,
    title: doc.title
  }));

  const conflictScore = calculateConflictScore(topCitations, documents as LegalDocument[]);

  return {
    TopCitations: topCitations,
    ConflictScore: conflictScore
  };
}

function calculateRelevanceScore(query: string, doc: LegalDocument): number {
  let score = 0;
  const queryTerms = query.split(/\s+/).filter(term => term.length > 3);
  const searchableText = `${doc.title} ${doc.citation_text} ${doc.category}`.toLowerCase();

  queryTerms.forEach(term => {
    const termCount = (searchableText.match(new RegExp(term, 'g')) || []).length;
    score += termCount * 10;
  });

  if (doc.category === 'Eligibility') score += 20;
  if (doc.category === 'Exceptions') score += 15;
  if (doc.category === 'Definitions') score += 10;

  if (doc.effective_date) {
    const effectiveDate = new Date(doc.effective_date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 365) score += 5;
  }

  return score;
}

function calculateConflictScore(topCitations: Node1Output['TopCitations'], allDocuments: LegalDocument[]): number {
  if (topCitations.length < 2) return 1;

  let conflictIndicators = 0;

  const categories = topCitations.map(citation => {
    const doc = allDocuments.find(d => d.id === citation.id);
    return doc?.category;
  });

  const hasEligibility = categories.includes('Eligibility');
  const hasExceptions = categories.includes('Exceptions');
  const hasDefinitions = categories.includes('Definitions');

  if (hasEligibility && hasExceptions) {
    conflictIndicators += 3;
  }

  // G7 Enhancement: Definition conflicts across jurisdictions
  if (hasDefinitions && categories.filter(c => c === 'Definitions').length > 1) {
    conflictIndicators += 2;
  }

  const texts = topCitations.map(c => c.citation_text.toLowerCase());
  const conflictTerms = ['except', 'unless', 'however', 'notwithstanding', 'provided that', 'subject to'];

  texts.forEach(text => {
    conflictTerms.forEach(term => {
      if (text.includes(term)) conflictIndicators += 1;
    });
  });

  // G7 Enhancement: Multi-jurisdiction conflict detection
  const jurisdictions = topCitations.map(citation => {
    const doc = allDocuments.find(d => d.id === citation.id);
    return doc?.jurisdiction;
  }).filter((j): j is string => j !== undefined);

  const uniqueJurisdictions = new Set(jurisdictions);
  const g7Jurisdictions = Array.from(uniqueJurisdictions).filter(j => G7_JURISDICTIONS.includes(j));

  if (uniqueJurisdictions.size > 1) {
    conflictIndicators += 2;

    // Additional conflict for G7 cross-border scenarios
    if (g7Jurisdictions.length > 1) {
      conflictIndicators += 2;

      // Check for data protection stringency divergence
      const stringencyScores = g7Jurisdictions.map(j => DATA_PROTECTION_STRINGENCY[j] || 5);
      const stringencyRange = Math.max(...stringencyScores) - Math.min(...stringencyScores);
      if (stringencyRange >= 3) {
        conflictIndicators += 2; // Significant regulatory divergence
      }
    }

    // Check for EU vs non-EU jurisdiction conflicts
    const hasEU = g7Jurisdictions.some(j => ['European Union', 'Germany', 'France', 'Italy'].includes(j));
    const hasNonEU = g7Jurisdictions.some(j => ['United States', 'Japan', 'United Kingdom', 'Canada'].includes(j));
    if (hasEU && hasNonEU) {
      conflictIndicators += 1; // Cross-border data transfer complexity
    }
  }

  return Math.min(10, Math.max(1, Math.floor(conflictIndicators / 2) + 1));
}

// Export for testing
export { G7_JURISDICTIONS, DATA_PROTECTION_STRINGENCY };
