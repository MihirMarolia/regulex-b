import { supabase, LegalDocument, Node1Output } from '../lib/supabase';

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

  if (hasEligibility && hasExceptions) {
    conflictIndicators += 3;
  }

  const texts = topCitations.map(c => c.citation_text.toLowerCase());
  const conflictTerms = ['except', 'unless', 'however', 'notwithstanding', 'provided that', 'subject to'];

  texts.forEach(text => {
    conflictTerms.forEach(term => {
      if (text.includes(term)) conflictIndicators += 1;
    });
  });

  const jurisdictions = topCitations.map(citation => {
    const doc = allDocuments.find(d => d.id === citation.id);
    return doc?.jurisdiction;
  });

  const uniqueJurisdictions = new Set(jurisdictions);
  if (uniqueJurisdictions.size > 1) {
    conflictIndicators += 2;
  }

  return Math.min(10, Math.max(1, Math.floor(conflictIndicators / 2) + 1));
}
