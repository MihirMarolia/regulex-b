import { Node1Output, Node2Output } from '../lib/supabase';

/**
 * G7 Traceability Requirement (FR.3.1.3)
 * All outputs must include:
 * - Clear legal basis with citations
 * - Jurisdiction identifiers
 * - Conflict indicators when applicable
 */

export interface FormattedOutput {
  displayText: string;
  outcome: Node2Output['FinalOutcome'];
  citations: Node1Output['TopCitations'];
  // G7 Compliance metadata
  traceabilityCompliant: boolean;
  jurisdictionsReferenced: string[];
}

export function executeNode3(
  node1Output: Node1Output,
  node2Output: Node2Output
): FormattedOutput {
  const { FinalOutcome, RationaleSummary, BiasFlag } = node2Output;
  const { TopCitations, ConflictScore } = node1Output;

  // G7 FR.3.1.3 Traceability Enforcement
  const traceabilityCompliant = validateTraceability(TopCitations, FinalOutcome);

  const conclusion = formatConclusion(FinalOutcome);
  const interpretation = formatInterpretation(RationaleSummary, FinalOutcome);
  const legalBasis = formatLegalBasis(TopCitations);
  const complianceNote = formatComplianceNote(ConflictScore, BiasFlag, traceabilityCompliant);

  const displayText = `${conclusion}\n\n${interpretation}\n\n${legalBasis}${complianceNote}`;

  // Extract jurisdictions from citations for G7 interoperability tracking
  const jurisdictionsReferenced = extractJurisdictions(TopCitations);

  return {
    displayText,
    outcome: FinalOutcome,
    citations: TopCitations,
    traceabilityCompliant,
    jurisdictionsReferenced,
  };
}

/**
 * Validate traceability per FR.3.1.3
 * Returns true only if determination has proper legal basis
 */
function validateTraceability(
  citations: Node1Output['TopCitations'],
  outcome: Node2Output['FinalOutcome']
): boolean {
  // If outcome requires action (Eligible/Not Eligible), must have citations
  if (outcome === 'Eligible' || outcome === 'Not Eligible') {
    return citations.length > 0 && citations.every(c =>
      c.section_id && c.section_id.length > 0 &&
      c.citation_text && c.citation_text.length > 0
    );
  }
  // "Requires More Data" is always traceable as it's an admission of insufficiency
  return true;
}

/**
 * Extract unique jurisdictions from citations
 */
function extractJurisdictions(citations: Node1Output['TopCitations']): string[] {
  const jurisdictions = new Set<string>();

  citations.forEach(citation => {
    // Parse jurisdiction from section_id prefix
    const sectionId = citation.section_id || '';
    if (sectionId.startsWith('CA-')) jurisdictions.add('Canada');
    else if (sectionId.startsWith('FR-')) jurisdictions.add('France');
    else if (sectionId.startsWith('DE-')) jurisdictions.add('Germany');
    else if (sectionId.startsWith('IT-')) jurisdictions.add('Italy');
    else if (sectionId.startsWith('JP-')) jurisdictions.add('Japan');
    else if (sectionId.startsWith('UK-')) jurisdictions.add('United Kingdom');
    else if (sectionId.startsWith('US-')) jurisdictions.add('United States');
    else if (sectionId.startsWith('EU-')) jurisdictions.add('European Union');
  });

  return Array.from(jurisdictions);
}

/**
 * Format G7 compliance note for transparency
 */
function formatComplianceNote(
  conflictScore: number,
  biasFlag: Node2Output['BiasFlag'],
  traceabilityCompliant: boolean
): string {
  const notes: string[] = [];

  if (conflictScore >= 7) {
    notes.push('**HIGH CONFLICT SCORE**: Cross-jurisdictional review recommended.');
  }

  if (biasFlag === 'YES') {
    notes.push('**BIAS FLAG**: Protected characteristic detected - manual review required per G7 Fairness Principle.');
  }

  if (!traceabilityCompliant) {
    notes.push('**TRACEABILITY WARNING**: Insufficient legal basis per FR.3.1.3 - determination requires verification.');
  }

  if (notes.length === 0) {
    return '';
  }

  return `\n\n**G7 COMPLIANCE NOTES**\n\n${notes.join('\n\n')}`;
}

function formatConclusion(outcome: Node2Output['FinalOutcome']): string {
  switch (outcome) {
    case 'Eligible':
      return '**DETERMINATION: ELIGIBLE**';
    case 'Not Eligible':
      return '**DETERMINATION: NOT ELIGIBLE**';
    case 'Requires More Data':
      return '**DETERMINATION: ADDITIONAL REVIEW REQUIRED**';
    default:
      return '**DETERMINATION: PENDING**';
  }
}

function formatInterpretation(rationale: string, outcome: Node2Output['FinalOutcome']): string {
  let empathyStatement = '';

  switch (outcome) {
    case 'Eligible':
      empathyStatement = 'Based on the applicable legal framework, the determination supports eligibility. ';
      break;
    case 'Not Eligible':
      empathyStatement = 'After careful review of the relevant regulations, the current circumstances do not meet the eligibility criteria. ';
      break;
    case 'Requires More Data':
      empathyStatement = 'The legal framework applicable to this query contains complex provisions requiring additional assessment. ';
      break;
  }

  return `${empathyStatement}${rationale}`;
}

function formatLegalBasis(citations: Node1Output['TopCitations']): string {
  if (citations.length === 0) {
    return '**LEGAL BASIS**\n\nNo specific legal citations were identified for this query.';
  }

  const citationList = citations
    .map((citation, index) => {
      return `${index + 1}. **${citation.section_id}** - ${citation.title}\n   "${citation.citation_text.substring(0, 200)}${citation.citation_text.length > 200 ? '...' : ''}"`;
    })
    .join('\n\n');

  return `**LEGAL BASIS**\n\nThe following legal provisions form the basis for this determination:\n\n${citationList}`;
}
