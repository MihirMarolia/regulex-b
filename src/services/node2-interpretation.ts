import { Node1Output, Node2Output } from '../lib/supabase';

/**
 * G7 Hiroshima Process Guiding Principles
 * These principles govern AI ethics across G7 member nations
 */
const HIROSHIMA_PRINCIPLES = {
  FAIRNESS: 'Decisions must be applied without discriminatory consideration',
  SAFETY: 'AI must not facilitate misuse, harm, or circumvention of safety measures',
  TRANSPARENCY: 'All determinations must be explainable with clear legal basis',
  HUMAN_RIGHTS: 'Protected characteristics must be handled in legal context only',
};

// Safety/Misuse detection patterns - G7 Safety Principle compliance
const MISUSE_PATTERNS = [
  'circumvent',
  'bypass',
  'avoid restriction',
  'unauthorized',
  'illegal',
  'exploit',
  'loophole',
  'get around',
  'work around',
  'evade',
  'minimum steps to',
  'how to violate',
];

// Detect potential misuse intent in query
function detectMisuseIntent(query: string): { isMisuse: boolean; reason: string } {
  const queryLower = query.toLowerCase();

  for (const pattern of MISUSE_PATTERNS) {
    if (queryLower.includes(pattern)) {
      return {
        isMisuse: true,
        reason: `Query contains potential misuse language ("${pattern}"). Per G7 Safety Principle, interpretation for circumvention is not provided.`,
      };
    }
  }

  // Check for combination of safety terms + circumvention intent
  const hasSafetyContext = queryLower.includes('safety') || queryLower.includes('restriction') || queryLower.includes('prohibited');
  const hasCircumventionIntent = queryLower.includes('suggest') && (queryLower.includes('step') || queryLower.includes('way'));

  if (hasSafetyContext && hasCircumventionIntent) {
    return {
      isMisuse: true,
      reason: 'Query appears to seek guidance on circumventing safety restrictions. Per G7 Safety Principle, such interpretation is declined.',
    };
  }

  return { isMisuse: false, reason: '' };
}

export async function executeNode2(node1Output: Node1Output, userQuery: string): Promise<Node2Output> {
  const { TopCitations, ConflictScore } = node1Output;

  // G7 Safety Principle: Check for misuse intent first
  const misuseCheck = detectMisuseIntent(userQuery);
  if (misuseCheck.isMisuse) {
    return {
      FinalOutcome: 'Requires More Data',
      RationaleSummary: `${misuseCheck.reason} ${HIROSHIMA_PRINCIPLES.SAFETY}. Please reformulate your query to request legitimate legal interpretation.`,
      BiasFlag: 'NO'
    };
  }

  if (TopCitations.length === 0) {
    return {
      FinalOutcome: 'Requires More Data',
      RationaleSummary: `No relevant legal citations were found in the knowledge base. ${HIROSHIMA_PRINCIPLES.TRANSPARENCY} - additional information or clarification of the query is required to provide a determination.`,
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
  // G7 Hiroshima Process - Protected characteristics per Human Rights Principle
  const biasTerms = [
    'race', 'racial', 'ethnicity', 'ethnic', 'color', 'colour',
    'gender', 'sex', 'male', 'female', 'man', 'woman',
    'religion', 'religious', 'belief', 'faith',
    'national origin', 'nationality', 'citizenship',
    'age', 'disability', 'disabled',
    'sexual orientation', 'marital status',
    'pregnancy', 'pregnant',
    // Additional G7 protected characteristics
    'veteran status', 'genetic information', 'family status',
    'socioeconomic', 'class', 'caste'
  ];

  // Legal context phrases that indicate proper use of protected terms
  const legalContextPhrases = [
    'without regard to',
    'regardless of',
    'prohibited',
    'discrimination',
    'protected class',
    'non-discriminatory',
    'equal treatment',
    'anti-discrimination',
    'civil rights',
    'human rights',
    'fundamental rights'
  ];

  const allText = citationTexts.join(' ') + ' ' + userQuery;
  const allTextLower = allText.toLowerCase();

  // Check if any legal context is present
  const hasLegalContext = legalContextPhrases.some(phrase => allTextLower.includes(phrase));

  for (const term of biasTerms) {
    if (allTextLower.includes(term)) {
      // G7 Fairness Principle: Only flag if used outside legal context
      if (!hasLegalContext) {
        // Additional check: is the term in the query but in a legitimate question context?
        const queryLower = userQuery.toLowerCase();
        const isLegitimateQuestion =
          queryLower.includes('am i eligible') ||
          queryLower.includes('what are the requirements') ||
          queryLower.includes('how does') ||
          queryLower.includes('what is the');

        // If legitimate question about eligibility, don't flag unless explicitly discriminatory
        if (!isLegitimateQuestion || allTextLower.includes('more likely') || allTextLower.includes('less likely')) {
          return 'YES';
        }
      }
    }
  }

  return 'NO';
}

// Export for testing
export { HIROSHIMA_PRINCIPLES, MISUSE_PATTERNS, detectMisuseIntent };
