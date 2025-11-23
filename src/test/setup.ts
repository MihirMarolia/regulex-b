import { vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables for testing
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Global test utilities
export const mockSupabaseResponse = <T>(data: T | null, error: { message: string } | null = null) => ({
  data,
  error,
});

// Test timing utilities
export const measureExecutionTime = async <T>(fn: () => Promise<T>): Promise<{ result: T; timeMs: number }> => {
  const start = performance.now();
  const result = await fn();
  const timeMs = performance.now() - start;
  return { result, timeMs };
};
