import { supabase, LegalDocument, Node1Output } from '../lib/supabase';

export async function executeNode1(userQuery: string, primaryJurisdiction: string = 'Canada'): Promise<Node1Output> {
  // Simulate VSS: In production, this would call a stored procedure like match_documents()
  // that performs vector similarity search using pgvector extension.
  // For now, we fetch documents and simulate similarity scoring.
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

  // Simulate VSS similarity scores (in production, these would come from pgvector)
  // Mock similarity scores based on query term presence (0.0 to 1.0 range)
  const documentsWithSimilarity = documents.map(doc => {
    // Simulate a similarity score based on basic text matching
    // In production, this would be the cosine similarity from vector embeddings
    const mockSimilarityScore = calculateMockSimilarity(userQuery, doc);
    return {
      ...doc,
      similarity_score: mockSimilarityScore
    };
  });

  // Filter and boost by primary jurisdiction
  const filteredAndBoosted = documentsWithSimilarity.map(doc => {
    let score = doc.similarity_score * 100; // Scale to 0-100 range
    if (doc.jurisdiction === primaryJurisdiction) {
      score *= 1.5; // 50% boost for primary jurisdiction
    }
    return { ...doc, score };
  }).sort((a, b) => b.score - a.score); // Re-sort after boosting

  const topCitations = filteredAndBoosted.slice(0, 5).map((doc) => ({
    id: doc.id,
    citation_text: doc.citation_text,
    section_id: doc.section_id,
    title: doc.title,
    jurisdiction: doc.jurisdiction,
    category: doc.category
  }));

  const conflictScore = calculateConflictScore(topCitations, documents as LegalDocument[]);

  return {
    TopCitations: topCitations,
    ConflictScore: conflictScore
  };
}

/**
 * Mock similarity calculation to simulate vector similarity search.
 * In production, this would be replaced by actual pgvector cosine similarity.
 * Returns a score between 0.0 and 1.0.
 */
function calculateMockSimilarity(query: string, doc: LegalDocument): number {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 3);
  const searchableText = `${doc.title} ${doc.citation_text} ${doc.category}`.toLowerCase();

  if (queryTerms.length === 0) {
    return 0.5; // Base similarity when no meaningful query terms
  }

  let matchCount = 0;
  queryTerms.forEach(term => {
    if (searchableText.includes(term)) {
      matchCount++;
    }
  });

  // Base similarity from term matching (0.3 to 0.9 range)
  const termScore = 0.3 + (matchCount / queryTerms.length) * 0.6;

  // Category boost (simulates semantic relevance)
  let categoryBoost = 0;
  if (doc.category === 'Eligibility') categoryBoost = 0.05;
  if (doc.category === 'Exceptions') categoryBoost = 0.03;
  if (doc.category === 'Definitions') categoryBoost = 0.02;

  // Recency boost
  let recencyBoost = 0;
  if (doc.effective_date) {
    const effectiveDate = new Date(doc.effective_date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 365) recencyBoost = 0.02;
  }

  return Math.min(1.0, termScore + categoryBoost + recencyBoost);
}

interface CitationWithMetadata {
  id: string;
  citation_text: string;
  section_id: string;
  title: string;
  jurisdiction?: string;
  category?: string;
}

function calculateConflictScore(topCitations: CitationWithMetadata[], allDocuments: LegalDocument[]): number {
  if (topCitations.length < 2) return 1;

  let conflictIndicators = 0;

  // Get categories and jurisdictions from top citations
  const citationData = topCitations.map(citation => {
    const doc = allDocuments.find(d => d.id === citation.id);
    return {
      category: citation.category || doc?.category,
      jurisdiction: citation.jurisdiction || doc?.jurisdiction
    };
  });

  const categories = citationData.map(d => d.category);
  const jurisdictions = citationData.map(d => d.jurisdiction);

  // Check for Eligibility + Exceptions conflict
  const hasEligibility = categories.includes('Eligibility');
  const hasExceptions = categories.includes('Exceptions');

  if (hasEligibility && hasExceptions) {
    conflictIndicators += 3;
  }

  // Check for conflict terms in citation texts
  const texts = topCitations.map(c => c.citation_text.toLowerCase());
  const conflictTerms = ['except', 'unless', 'however', 'notwithstanding', 'provided that', 'subject to'];

  texts.forEach(text => {
    conflictTerms.forEach(term => {
      if (text.includes(term)) conflictIndicators += 1;
    });
  });

  // Cross-jurisdictional conflict detection (Enhanced for G7 interoperability)
  // Find categories that appear from multiple jurisdictions
  const categoryJurisdictionMap = new Map<string, Set<string>>();

  citationData.forEach(({ category, jurisdiction }) => {
    if (category && jurisdiction) {
      if (!categoryJurisdictionMap.has(category)) {
        categoryJurisdictionMap.set(category, new Set());
      }
      categoryJurisdictionMap.get(category)!.add(jurisdiction);
    }
  });

  // Add +5 for each category that appears from 2+ different jurisdictions
  // This directly addresses the Interoperability Test (TC 1.1)
  categoryJurisdictionMap.forEach((jurisdictionSet, category) => {
    if (jurisdictionSet.size >= 2) {
      conflictIndicators += 5; // Enhanced cross-jurisdictional conflict score
    }
  });

  // Also add general multi-jurisdiction penalty
  const uniqueJurisdictions = new Set(jurisdictions.filter(Boolean));
  if (uniqueJurisdictions.size > 1) {
    conflictIndicators += 2;
  }

  return Math.min(10, Math.max(1, Math.floor(conflictIndicators / 2) + 1));
}
