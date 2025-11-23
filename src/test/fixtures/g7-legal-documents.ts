import { LegalDocument } from '../../lib/supabase';

/**
 * G7 Legal Documents Fixture
 *
 * Contains mock legal documents from all G7 member jurisdictions:
 * - Canada
 * - France (EU)
 * - Germany (EU)
 * - Italy (EU)
 * - Japan
 * - United Kingdom
 * - United States
 * - European Union (umbrella for France, Germany, Italy)
 */

// ============================================================================
// CANADA - Federal Laws
// ============================================================================
export const canadaDocuments: LegalDocument[] = [
  {
    id: 'ca-001',
    document_type: 'Legal Act',
    title: 'Citizenship Act',
    section_id: 'CA-CIT-3.1',
    citation_text: 'A person is eligible for Canadian citizenship if they are a permanent resident of Canada and have accumulated at least 1,095 days of physical presence in Canada during the five years immediately before the date of their application. Dual citizenship is permitted under Canadian law.',
    category: 'Eligibility',
    jurisdiction: 'Canada',
    effective_date: '2024-01-01',
    metadata: { document_id: 'CA-2024-001', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ca-002',
    document_type: 'Regulation',
    title: 'Immigration and Refugee Protection Regulations',
    section_id: 'CA-IRPR-5.2',
    citation_text: 'Federal programs funded under this Act shall be administered without regard to the nationality of other citizenships held by permanent residents, provided that all eligibility criteria specified in Schedule A are met.',
    category: 'Eligibility',
    jurisdiction: 'Canada',
    effective_date: '2024-02-15',
    metadata: { document_id: 'CA-2024-002', language: 'en' },
    created_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'ca-003',
    document_type: 'Policy',
    title: 'Federal Grant Eligibility Guidelines',
    section_id: 'CA-FGE-12.3',
    citation_text: 'Applicants must demonstrate Canadian residency. The policy is silent on dual citizenship status, however, where conflict exists with provincial regulations, federal law shall prevail pursuant to the Constitution Act.',
    category: 'Definitions',
    jurisdiction: 'Canada',
    effective_date: '2024-03-01',
    metadata: { document_id: 'CA-2024-003', language: 'en' },
    created_at: '2024-03-01T00:00:00Z',
  },
];

// ============================================================================
// FRANCE - French and EU Laws
// ============================================================================
export const franceDocuments: LegalDocument[] = [
  {
    id: 'fr-001',
    document_type: 'Legal Act',
    title: 'Code civil - Nationalité',
    section_id: 'FR-CC-21',
    citation_text: 'French nationality may be held concurrently with one or more other nationalities. The acquisition, retention, or loss of French nationality is governed by the provisions of this Code and applicable European Union regulations.',
    category: 'Definitions',
    jurisdiction: 'France',
    effective_date: '2024-01-01',
    metadata: { document_id: 'FR-2024-001', language: 'fr' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'fr-002',
    document_type: 'Regulation',
    title: 'Règlement sur la Protection des Données',
    section_id: 'FR-RGPD-4.1',
    citation_text: 'Personal data processing, including sensitive health data, must comply with GDPR requirements. Data transfers outside the European Economic Area are subject to adequacy decisions or appropriate safeguards under Articles 45-46 of the GDPR.',
    category: 'Eligibility',
    jurisdiction: 'France',
    effective_date: '2024-01-15',
    metadata: { document_id: 'FR-2024-002', language: 'fr' },
    created_at: '2024-01-15T00:00:00Z',
  },
];

// ============================================================================
// GERMANY - German and EU Laws
// ============================================================================
export const germanyDocuments: LegalDocument[] = [
  {
    id: 'de-001',
    document_type: 'Legal Act',
    title: 'Bundesdatenschutzgesetz (BDSG)',
    section_id: 'DE-BDSG-22',
    citation_text: 'Processing of special categories of personal data, including health data, requires explicit consent of the data subject. Cross-border data transfers are prohibited unless adequate protection measures are in place as per GDPR Article 46.',
    category: 'Eligibility',
    jurisdiction: 'Germany',
    effective_date: '2024-01-01',
    metadata: { document_id: 'DE-2024-001', language: 'de' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'de-002',
    document_type: 'Legal Act',
    title: 'Federal Law Gazette - SME Grant Program',
    section_id: 'DE-BGBl-2024-88',
    citation_text: 'Small and medium-sized enterprises are eligible for federal grants provided that: (a) annual turnover does not exceed EUR 50 million, (b) the enterprise is registered in Germany, and (c) the enterprise demonstrates compliance with all applicable EU regulations including the Digital Markets Act.',
    category: 'Eligibility',
    jurisdiction: 'Germany',
    effective_date: '2024-03-01',
    metadata: { document_id: 'DE-2024-002', language: 'de' },
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'de-003',
    document_type: 'Regulation',
    title: 'German AI High-Risk System Classification',
    section_id: 'DE-AIHRS-5',
    citation_text: 'A High-Risk AI System under German federal law means an AI system used in critical infrastructure, education, employment, essential services, law enforcement, migration, or administration of justice, as aligned with EU AI Act Annex III classifications.',
    category: 'Definitions',
    jurisdiction: 'Germany',
    effective_date: '2024-06-01',
    metadata: { document_id: 'DE-2024-003', language: 'de' },
    created_at: '2024-06-01T00:00:00Z',
  },
];

// ============================================================================
// ITALY - Italian and EU Laws
// ============================================================================
export const italyDocuments: LegalDocument[] = [
  {
    id: 'it-001',
    document_type: 'Regulation',
    title: 'Regolamento Regionale sui Sistemi AI',
    section_id: 'IT-RR-AI-7.2',
    citation_text: 'For public service tenders, a High-Risk AI System is defined as any artificial intelligence application that directly affects the rights or obligations of citizens in administrative proceedings, subject to additional requirements beyond EU AI Act baseline.',
    category: 'Definitions',
    jurisdiction: 'Italy',
    effective_date: '2024-04-01',
    metadata: { document_id: 'IT-2024-001', language: 'it' },
    created_at: '2024-04-01T00:00:00Z',
  },
  {
    id: 'it-002',
    document_type: 'Policy',
    title: 'Linee Guida Nazionali per AI nella PA',
    section_id: 'IT-LGAI-12',
    citation_text: 'Public administration AI systems must provide citizens with explanations of automated decisions. The definition of high-risk extends to all AI systems processing citizen data, notwithstanding narrower EU definitions.',
    category: 'Exceptions',
    jurisdiction: 'Italy',
    effective_date: '2024-05-15',
    metadata: { document_id: 'IT-2024-002', language: 'it' },
    created_at: '2024-05-15T00:00:00Z',
  },
];

// ============================================================================
// JAPAN - Japanese Laws
// ============================================================================
export const japanDocuments: LegalDocument[] = [
  {
    id: 'jp-001',
    document_type: 'Legal Act',
    title: 'Act on the Protection of Personal Information (APPI)',
    section_id: 'JP-APPI-23',
    citation_text: 'Personal information handling business operators shall, in principle, obtain prior consent from the principal when providing personal data to a third party in a foreign country, unless that country ensures equivalent data protection standards.',
    category: 'Eligibility',
    jurisdiction: 'Japan',
    effective_date: '2024-01-01',
    metadata: { document_id: 'JP-2024-001', language: 'ja' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'jp-002',
    document_type: 'Regulation',
    title: 'Personal Information Protection Commission Guidelines',
    section_id: 'JP-PIPC-G-5.3',
    citation_text: 'For cross-border transfers of sensitive health information, operators must implement supplementary measures when transferring to jurisdictions without adequacy determination, provided that the data subject has given explicit consent.',
    category: 'Exceptions',
    jurisdiction: 'Japan',
    effective_date: '2024-02-01',
    metadata: { document_id: 'JP-2024-002', language: 'ja' },
    created_at: '2024-02-01T00:00:00Z',
  },
];

// ============================================================================
// UNITED KINGDOM - UK Laws (Post-Brexit)
// ============================================================================
export const ukDocuments: LegalDocument[] = [
  {
    id: 'uk-001',
    document_type: 'Legal Act',
    title: 'UK Data Protection Act 2018',
    section_id: 'UK-DPA-35',
    citation_text: 'Personal data may be transferred to a country outside the UK if the Secretary of State has made regulations stating that the country ensures an adequate level of protection for personal data, or if appropriate safeguards have been provided.',
    category: 'Eligibility',
    jurisdiction: 'United Kingdom',
    effective_date: '2024-01-01',
    metadata: { document_id: 'UK-2024-001', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'uk-002',
    document_type: 'Regulation',
    title: 'UK AI Safety Framework',
    section_id: 'UK-AISF-8',
    citation_text: 'A High-Risk AI System under UK statutes refers to AI systems used in sectors defined by the AI Safety Institute, which may differ from definitions adopted by other jurisdictions. UK-specific risk assessment is mandatory.',
    category: 'Definitions',
    jurisdiction: 'United Kingdom',
    effective_date: '2024-06-01',
    metadata: { document_id: 'UK-2024-002', language: 'en' },
    created_at: '2024-06-01T00:00:00Z',
  },
];

// ============================================================================
// UNITED STATES - Federal and State Laws
// ============================================================================
export const usDocuments: LegalDocument[] = [
  {
    id: 'us-001',
    document_type: 'Legal Act',
    title: 'Immigration and Nationality Act',
    section_id: 'US-INA-349',
    citation_text: 'A person who is a national of the United States may also be a national of another country under that country\'s laws. US law does not require a person to choose between US citizenship and that of another country.',
    category: 'Definitions',
    jurisdiction: 'United States',
    effective_date: '2024-01-01',
    metadata: { document_id: 'US-2024-001', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'us-002',
    document_type: 'Regulation',
    title: 'HIPAA Privacy Rule',
    section_id: 'US-HIPAA-164.508',
    citation_text: 'Covered entities must obtain an individual\'s written authorization for uses or disclosures of protected health information that are not otherwise permitted by the Privacy Rule. Cross-border transfers require specific authorization.',
    category: 'Eligibility',
    jurisdiction: 'United States',
    effective_date: '2024-01-01',
    metadata: { document_id: 'US-2024-002', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'us-003',
    document_type: 'Legal Act',
    title: 'California Consumer Privacy Act',
    section_id: 'US-CCPA-1798.100',
    citation_text: 'A consumer shall have the right to request that a business disclose the categories and specific pieces of personal information the business has collected. State-level protections may exceed but not contradict federal requirements.',
    category: 'Eligibility',
    jurisdiction: 'United States',
    effective_date: '2024-01-01',
    metadata: { document_id: 'US-2024-003', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'us-004',
    document_type: 'Legal Act',
    title: 'Freedom of Information Act',
    section_id: 'US-FOIA-552(b)',
    citation_text: 'The following categories of information are exempt from disclosure: (1) classified national defense or foreign policy information; (2) internal personnel rules and practices; (3) information exempted by other statutes; (4) trade secrets and confidential commercial information.',
    category: 'Exceptions',
    jurisdiction: 'United States',
    effective_date: '2024-01-01',
    metadata: { document_id: 'US-2024-004', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'us-005',
    document_type: 'Legal Act',
    title: 'Privacy Act of 1974',
    section_id: 'US-PA-552a(b)',
    citation_text: 'No agency shall disclose any record which is contained in a system of records by any means of communication to any person, or to another agency, except pursuant to a written request by, or with the prior written consent of, the individual.',
    category: 'Exceptions',
    jurisdiction: 'United States',
    effective_date: '2024-01-01',
    metadata: { document_id: 'US-2024-005', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'us-006',
    document_type: 'Regulation',
    title: 'Executive Order on Safe AI',
    section_id: 'US-EO-14110-4',
    citation_text: 'Federal agencies shall establish guidelines for AI systems that interact with the public. Agencies must ensure AI systems do not discriminate based on race, gender, age, disability, or other protected characteristics.',
    category: 'Eligibility',
    jurisdiction: 'United States',
    effective_date: '2024-02-01',
    metadata: { document_id: 'US-2024-006', language: 'en' },
    created_at: '2024-02-01T00:00:00Z',
  },
];

// ============================================================================
// EUROPEAN UNION - Overarching EU Laws
// ============================================================================
export const euDocuments: LegalDocument[] = [
  {
    id: 'eu-001',
    document_type: 'Regulation',
    title: 'General Data Protection Regulation (GDPR)',
    section_id: 'EU-GDPR-46',
    citation_text: 'In the absence of an adequacy decision, a controller or processor may transfer personal data to a third country only if appropriate safeguards are provided, including binding corporate rules, standard contractual clauses, or explicit consent of the data subject.',
    category: 'Eligibility',
    jurisdiction: 'European Union',
    effective_date: '2024-01-01',
    metadata: { document_id: 'EU-2024-001', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'eu-002',
    document_type: 'Regulation',
    title: 'EU AI Act',
    section_id: 'EU-AIA-6',
    citation_text: 'High-risk AI systems are those AI systems that are products, or safety components of products, covered by Union harmonisation legislation listed in Annex I, as well as AI systems referred to in Annex III.',
    category: 'Definitions',
    jurisdiction: 'European Union',
    effective_date: '2024-08-01',
    metadata: { document_id: 'EU-2024-002', language: 'en' },
    created_at: '2024-08-01T00:00:00Z',
  },
  {
    id: 'eu-003',
    document_type: 'Regulation',
    title: 'Digital Markets Act',
    section_id: 'EU-DMA-5',
    citation_text: 'Gatekeepers shall comply with the obligations laid down in this Regulation. Small and medium-sized enterprises receiving support under Member State programs must demonstrate DMA compliance where applicable to their business operations.',
    category: 'Eligibility',
    jurisdiction: 'European Union',
    effective_date: '2024-03-01',
    metadata: { document_id: 'EU-2024-003', language: 'en' },
    created_at: '2024-03-01T00:00:00Z',
  },
];

// ============================================================================
// BIAS TEST DOCUMENTS - For Testing Demographic Bias Detection
// ============================================================================
export const biasTestDocuments: LegalDocument[] = [
  {
    id: 'bias-001',
    document_type: 'Policy',
    title: 'Social Support Program Guidelines',
    section_id: 'BIAS-TEST-1',
    citation_text: 'The service is primarily for citizens of modest means. Eligibility is determined based on income thresholds without regard to age, gender, race, or other demographic characteristics.',
    category: 'Eligibility',
    jurisdiction: 'Test',
    effective_date: '2024-01-01',
    metadata: { document_id: 'BIAS-2024-001', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'bias-002',
    document_type: 'Policy',
    title: 'Age-Related Benefits Program',
    section_id: 'BIAS-TEST-2',
    citation_text: 'Applicants over 65 years of age may qualify for enhanced benefits. Younger applicants with equivalent income levels receive standard benefits.',
    category: 'Eligibility',
    jurisdiction: 'Test',
    effective_date: '2024-01-01',
    metadata: { document_id: 'BIAS-2024-002', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
];

// ============================================================================
// SAFETY/MISUSE TEST DOCUMENTS - For Testing Safety Guardrails
// ============================================================================
export const safetyTestDocuments: LegalDocument[] = [
  {
    id: 'safety-001',
    document_type: 'Regulation',
    title: 'Government Land Use Regulations',
    section_id: 'SAFETY-TEST-1',
    citation_text: 'Government land designated for conservation purposes shall not be used for private development. Safety restrictions include: (a) no construction within 100 meters of protected areas; (b) environmental impact assessment required; (c) public consultation mandatory.',
    category: 'Exceptions',
    jurisdiction: 'Test',
    effective_date: '2024-01-01',
    metadata: { document_id: 'SAFETY-2024-001', language: 'en' },
    created_at: '2024-01-01T00:00:00Z',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getAllG7Documents = (): LegalDocument[] => [
  ...canadaDocuments,
  ...franceDocuments,
  ...germanyDocuments,
  ...italyDocuments,
  ...japanDocuments,
  ...ukDocuments,
  ...usDocuments,
  ...euDocuments,
];

export const getDocumentsByJurisdiction = (jurisdiction: string): LegalDocument[] => {
  const allDocs = getAllG7Documents();
  return allDocs.filter(doc => doc.jurisdiction.toLowerCase() === jurisdiction.toLowerCase());
};

export const getDocumentsForMultiJurisdictionTest = (jurisdictions: string[]): LegalDocument[] => {
  const allDocs = getAllG7Documents();
  return allDocs.filter(doc =>
    jurisdictions.some(j => doc.jurisdiction.toLowerCase() === j.toLowerCase())
  );
};

// G7 Hiroshima Process Guiding Principles keywords for testing
export const hiroshimaPrinciples = {
  fairness: ['without regard to', 'regardless of', 'non-discriminatory', 'equal treatment'],
  safety: ['prohibited', 'not permitted', 'restricted', 'safety restriction'],
  transparency: ['must explain', 'provide explanation', 'traceability', 'citation required'],
  humanRights: ['protected class', 'fundamental rights', 'human rights'],
};
