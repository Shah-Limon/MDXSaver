import yaml from 'js-yaml';
import { ParsingResult, ParsedMetadata } from '../types';

/**
 * Extracts the YAML frontmatter block from MDX content.
 * Supports standard YAML frontmatter delimited by ---
 * Handles leading whitespace, different line endings, and content wrapped in markdown code blocks.
 */
export const extractFrontmatter = (content: string): string | null => {
  // Regex explanation:
  // ^\s*                     : Start of string, optional whitespace
  // (?:```[^\r\n]*[\r\n]+)?  : Optional markdown code fence start (e.g. ```markdown)
  // \s*                      : Optional whitespace
  // ---                      : Opening delimiter
  // [ \t]*                   : Optional spaces/tabs
  // [\r\n]+                  : Newline(s)
  // ([\s\S]*?)               : Capture group for content (non-greedy)
  // [\r\n]+                  : Newline(s) before closing delimiter
  // ---                      : Closing delimiter
  const match = content.match(/^\s*(?:```[^\r\n]*[\r\n]+)?\s*---[ \t]*[\r\n]+([\s\S]*?)[\r\n]+---/);
  return match ? match[1] : null;
};

/**
 * Parses the canonical URL to get the slug.
 */
export const getSlugFromUrl = (url: string): string | null => {
  try {
    // Handle relative URLs if necessary, though canonical is usually absolute
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Split by slash and filter empty strings (handles trailing slashes)
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 0) return null;
    
    // The slug is typically the last segment
    return segments[segments.length - 1];
  } catch (e) {
    // Fallback for non-standard URL strings if URL constructor fails
    // e.g. if the user just put a path like "/blog/my-post"
    const parts = url.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : null;
  }
};

/**
 * Main logic to analyze content and determine filename.
 */
export const analyzeContent = (content: string): ParsingResult => {
  const yamlContent = extractFrontmatter(content);

  if (!yamlContent) {
    return {
      filename: 'untitled.mdx',
      isValid: false,
      error: 'No YAML Frontmatter found (must start with ---)',
    };
  }

  try {
    const parsed = yaml.load(yamlContent) as ParsedMetadata;

    if (!parsed || typeof parsed !== 'object') {
       return {
        filename: 'untitled.mdx',
        isValid: false,
        error: 'YAML Frontmatter is invalid or empty',
      };
    }

    // Support both nested metadata.canonical and root-level canonical
    const canonical = parsed.metadata?.canonical || parsed.canonical;

    if (!canonical) {
      return {
        filename: 'untitled.mdx',
        isValid: true, // Valid YAML, just missing the specific key
        error: 'Key "canonical" (or "metadata.canonical") not found in Frontmatter',
      };
    }

    const slug = getSlugFromUrl(canonical);

    if (!slug) {
       return {
        filename: 'untitled.mdx',
        isValid: true,
        error: 'Could not extract slug from canonical URL',
        canonicalFound: canonical,
      };
    }

    return {
      filename: `${slug}.mdx`,
      isValid: true,
      canonicalFound: canonical,
    };

  } catch (e: any) {
    return {
      filename: 'untitled.mdx',
      isValid: false,
      error: `YAML Syntax Error: ${e.message}`,
    };
  }
};