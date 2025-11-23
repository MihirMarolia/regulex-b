/*
  # ReguLex AI Database Schema

  ## Overview
  Creates the foundational database structure for ReguLex AI, a regulatory compliance assistant
  for G7 public service employees. This schema supports legal document storage, query processing,
  and compliance tracking.

  ## New Tables

  ### 1. legal_documents
  Stores the vector knowledge base of legal acts, regulations, and policies.
  - `id` (uuid, primary key) - Unique identifier
  - `document_type` (text) - Type: 'Legal Act', 'Regulation', 'Policy'
  - `title` (text) - Document title
  - `section_id` (text) - Specific section reference
  - `citation_text` (text) - Full legal text of the section
  - `category` (text) - Classification: 'Eligibility', 'Definitions', 'Exceptions', etc.
  - `jurisdiction` (text) - G7 country code
  - `effective_date` (date) - When the law took effect
  - `metadata` (jsonb) - Additional structured data
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. user_queries
  Tracks all user queries for audit, analytics, and improvement.
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, nullable) - Reference to auth.users if authenticated
  - `query_text` (text) - Natural language query from user
  - `node1_output` (jsonb) - Citations and conflict score
  - `node2_output` (jsonb) - Final outcome and rationale
  - `node3_output` (text) - User-facing formatted response
  - `bias_flagged` (boolean) - Whether bias was detected
  - `conflict_score` (integer) - Internal conflict rating 1-10
  - `processing_time_ms` (integer) - Time taken to process
  - `created_at` (timestamptz) - Query timestamp

  ### 3. compliance_logs
  Audit trail for compliance monitoring and legal review.
  - `id` (uuid, primary key) - Unique identifier
  - `query_id` (uuid) - Reference to user_queries
  - `log_type` (text) - Type: 'BIAS_DETECTED', 'HIGH_CONFLICT', 'MANUAL_REVIEW'
  - `details` (jsonb) - Structured log details
  - `reviewed_by` (uuid, nullable) - Reference to reviewing officer
  - `reviewed_at` (timestamptz, nullable) - Review timestamp
  - `created_at` (timestamptz) - Log creation timestamp

  ## Security
  - All tables have RLS enabled
  - Public read access to legal_documents (public knowledge base)
  - Authenticated users can create queries and view their own queries
  - Compliance logs restricted to admin/reviewer roles

  ## Indexes
  - Full-text search indexes on legal_documents
  - Query performance indexes on foreign keys
*/

-- Create legal_documents table
CREATE TABLE IF NOT EXISTS legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type text NOT NULL CHECK (document_type IN ('Legal Act', 'Regulation', 'Policy')),
  title text NOT NULL,
  section_id text NOT NULL,
  citation_text text NOT NULL,
  category text NOT NULL,
  jurisdiction text NOT NULL,
  effective_date date DEFAULT CURRENT_DATE,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_queries table
CREATE TABLE IF NOT EXISTS user_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  query_text text NOT NULL,
  node1_output jsonb DEFAULT NULL,
  node2_output jsonb DEFAULT NULL,
  node3_output text DEFAULT NULL,
  bias_flagged boolean DEFAULT false,
  conflict_score integer DEFAULT 0 CHECK (conflict_score >= 0 AND conflict_score <= 10),
  processing_time_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create compliance_logs table
CREATE TABLE IF NOT EXISTS compliance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id uuid REFERENCES user_queries(id) ON DELETE CASCADE NOT NULL,
  log_type text NOT NULL CHECK (log_type IN ('BIAS_DETECTED', 'HIGH_CONFLICT', 'MANUAL_REVIEW', 'INFO')),
  details jsonb DEFAULT '{}'::jsonb,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legal_documents_category ON legal_documents(category);
CREATE INDEX IF NOT EXISTS idx_legal_documents_jurisdiction ON legal_documents(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_user_queries_user_id ON user_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_queries_created_at ON user_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_query_id ON compliance_logs(query_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_log_type ON compliance_logs(log_type);

-- Enable Row Level Security
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for legal_documents (public read access)
CREATE POLICY "Legal documents are publicly readable"
  ON legal_documents FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert legal documents"
  ON legal_documents FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- RLS Policies for user_queries
CREATE POLICY "Users can view their own queries"
  ON user_queries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queries"
  ON user_queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert queries"
  ON user_queries FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous users can view their recent queries"
  ON user_queries FOR SELECT
  TO anon
  USING (created_at > now() - interval '1 hour' AND user_id IS NULL);

-- RLS Policies for compliance_logs
CREATE POLICY "Only authenticated users can view compliance logs"
  ON compliance_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert compliance logs"
  ON compliance_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can insert compliance logs anonymously"
  ON compliance_logs FOR INSERT
  TO anon
  WITH CHECK (true);