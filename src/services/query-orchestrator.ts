import { supabase } from '../lib/supabase';
import { executeNode1 } from './node1-retrieval';
import { executeNode2 } from './node2-interpretation';
import { executeNode3, FormattedOutput } from './node3-formatting';

export interface QueryResult extends FormattedOutput {
  queryId: string;
  processingTimeMs: number;
  biasDetected: boolean;
  conflictScore: number;
}

export async function processQuery(userQuery: string, primaryJurisdiction: string = 'Canada'): Promise<QueryResult> {
  const startTime = Date.now();

  const node1Output = await executeNode1(userQuery, primaryJurisdiction);

  const node2Output = await executeNode2(node1Output, userQuery);

  const node3Output = executeNode3(node1Output, node2Output);

  const processingTime = Date.now() - startTime;

  const { data: queryRecord, error } = await supabase
    .from('user_queries')
    .insert({
      query_text: userQuery,
      node1_output: node1Output,
      node2_output: node2Output,
      node3_output: node3Output.displayText,
      bias_flagged: node2Output.BiasFlag === 'YES',
      conflict_score: node1Output.ConflictScore,
      processing_time_ms: processingTime
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save query:', error);
  }

  if (node2Output.BiasFlag === 'YES') {
    await supabase.from('compliance_logs').insert({
      query_id: queryRecord?.id || 'unknown',
      log_type: 'BIAS_DETECTED',
      details: {
        query: userQuery,
        rationale: node2Output.RationaleSummary
      }
    });
  }

  if (node1Output.ConflictScore >= 7) {
    await supabase.from('compliance_logs').insert({
      query_id: queryRecord?.id || 'unknown',
      log_type: 'HIGH_CONFLICT',
      details: {
        conflict_score: node1Output.ConflictScore,
        citations_count: node1Output.TopCitations.length
      }
    });
  }

  return {
    ...node3Output,
    queryId: queryRecord?.id || 'unknown',
    processingTimeMs: processingTime,
    biasDetected: node2Output.BiasFlag === 'YES',
    conflictScore: node1Output.ConflictScore
  };
}
