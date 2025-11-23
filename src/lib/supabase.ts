import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LegalDocument {
  id: string;
  document_type: 'Legal Act' | 'Regulation' | 'Policy';
  title: string;
  section_id: string;
  citation_text: string;
  category: string;
  jurisdiction: string;
  effective_date: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserQuery {
  id: string;
  user_id: string | null;
  query_text: string;
  node1_output: Node1Output | null;
  node2_output: Node2Output | null;
  node3_output: string | null;
  bias_flagged: boolean;
  conflict_score: number;
  processing_time_ms: number;
  created_at: string;
}

export interface Node1Output {
  TopCitations: Array<{
    id: string;
    citation_text: string;
    section_id: string;
    title: string;
  }>;
  ConflictScore: number;
}

export interface Node2Output {
  FinalOutcome: 'Eligible' | 'Not Eligible' | 'Requires More Data';
  RationaleSummary: string;
  BiasFlag: 'YES' | 'NO';
}

export interface ComplianceLog {
  id: string;
  query_id: string;
  log_type: 'BIAS_DETECTED' | 'HIGH_CONFLICT' | 'MANUAL_REVIEW' | 'INFO';
  details: Record<string, any>;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}
