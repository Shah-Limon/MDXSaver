export interface ParsedMetadata {
  metadata?: {
    canonical?: string;
    [key: string]: any;
  };
  canonical?: string;
  [key: string]: any;
}

export interface ParsingResult {
  filename: string;
  isValid: boolean;
  error?: string;
  canonicalFound?: string;
}