import { Node1Output, Node2Output } from '../lib/supabase';

export interface FormattedOutput {
  displayText: string;
  outcome: Node2Output['FinalOutcome'];
  citations: Node1Output['TopCitations'];
}

export function executeNode3(
  node1Output: Node1Output,
  node2Output: Node2Output
): FormattedOutput {
  const { FinalOutcome, RationaleSummary } = node2Output;
  const { TopCitations } = node1Output;

  const conclusion = formatConclusion(FinalOutcome);
  const interpretation = formatInterpretation(RationaleSummary, FinalOutcome);
  const legalBasis = formatLegalBasis(TopCitations);

  const displayText = `${conclusion}\n\n${interpretation}\n\n${legalBasis}`;

  return {
    displayText,
    outcome: FinalOutcome,
    citations: TopCitations
  };
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
