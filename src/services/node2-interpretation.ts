import { Node1Output, Node2Output } from '../lib/supabase';

export async function executeNode2(node1Output: Node1Output, userQuery: string): Promise<Node2Output> {
  const { TopCitations, ConflictScore } = node1Output;

  if (TopCitations.length === 0) {
    return {
      FinalOutcome: 'Requires More Data',
      RationaleSummary: 'No relevant legal citations were found in the knowledge base. Additional information or clarification of the query is required to provide a determination.',
      BiasFlag: 'NO'
    };
  }

  const analysisResult = performStepByStepAnalysis(TopCitations, ConflictScore, userQuery);

  return analysisResult;
}

function performStepByStepAnalysis(
  citations: Node1Output['TopCitations'],
  conflictScore: number,
  userQuery: string
): Node2Output {
  const queryLower = userQuery.toLowerCase();
  const citationTexts = citations.map(c => c.citation_text.toLowerCase());

  const biasFlag = detectBias(citationTexts, queryLower);

  let eligibilityIndicators = 0;
  let ineligibilityIndicators = 0;
  let uncertaintyIndicators = 0;

  citationTexts.forEach(text => {
    if (text.includes('eligible') || text.includes('entitled') || text.includes('qualifies')) {
      eligibilityIndicators++;
    }

    if (text.includes('not eligible') || text.includes('ineligible') || text.includes('excluded') ||
        text.includes('prohibited') || text.includes('disqualified')) {
      ineligibilityIndicators++;
    }

    if (text.includes('may') || text.includes('discretion') || text.includes('case-by-case') ||
        text.includes('subject to review') || text.includes('upon approval')) {
      uncertaintyIndicators++;
    }
  });

  const hasExceptions = citations.some(c => {
    const text = c.citation_text.toLowerCase();
    return text.includes('except') || text.includes('unless') || text.includes('provided that');
  });

  if (hasExceptions) {
    uncertaintyIndicators += 2;
  }

  if (conflictScore >= 7) {
    uncertaintyIndicators += 3;
  }

  let finalOutcome: Node2Output['FinalOutcome'];
  let rationaleSummary: string;

  if (uncertaintyIndicators > 2 || conflictScore >= 8) {
    finalOutcome = 'Requires More Data';
    rationaleSummary = `The analysis identified ${citations.length} relevant legal sections with a conflict score of ${conflictScore}/10. The cited provisions contain conditional language, exceptions, or conflicting requirements that prevent a definitive determination. Manual review by a compliance officer is recommended to assess the specific circumstances.`;
  } else if (ineligibilityIndicators > eligibilityIndicators) {
    finalOutcome = 'Not Eligible';
    rationaleSummary = `Based on ${citations.length} legal citations, the analysis indicates ineligibility. The relevant provisions contain explicit exclusions or prohibitions that apply to the query circumstances. Review sections ${citations.slice(0, 2).map(c => c.section_id).join(', ')} for full details.`;
  } else if (eligibilityIndicators > 0) {
    finalOutcome = 'Eligible';
    rationaleSummary = `The analysis of ${citations.length} legal sections indicates eligibility under the cited provisions. The relevant legal framework supports this determination with a conflict score of ${conflictScore}/10, indicating ${conflictScore < 5 ? 'low' : 'moderate'} internal complexity. Refer to sections ${citations.slice(0, 2).map(c => c.section_id).join(', ')} for the legal basis.`;
  } else {
    finalOutcome = 'Requires More Data';
    rationaleSummary = `The retrieved legal citations do not provide sufficient clarity for a definitive determination. The conflict score of ${conflictScore}/10 suggests complex or ambiguous provisions. Additional context or expert legal interpretation is required.`;
  }

  return {
    FinalOutcome: finalOutcome,
    RationaleSummary: rationaleSummary,
    BiasFlag: biasFlag
  };
}

function detectBias(citationTexts: string[], userQuery: string): 'YES' | 'NO' {
  const biasTerms = [
    'race', 'racial', 'ethnicity', 'ethnic', 'color', 'colour',
    'gender', 'sex', 'male', 'female', 'man', 'woman',
    'religion', 'religious', 'belief', 'faith',
    'national origin', 'nationality', 'citizenship',
    'age', 'disability', 'disabled',
    'sexual orientation', 'marital status',
    'pregnancy', 'pregnant'
  ];

  const allText = citationTexts.join(' ') + ' ' + userQuery;

  for (const term of biasTerms) {
    if (allText.includes(term)) {
      const legalContext =
        allText.includes('without regard to') ||
        allText.includes('regardless of') ||
        allText.includes('prohibited') ||
        allText.includes('discrimination') ||
        allText.includes('protected class');

      if (!legalContext) {
        return 'YES';
      }
    }
  }

  return 'NO';
}
