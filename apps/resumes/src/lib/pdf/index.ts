/**
 * PDF Utilities Index
 *
 * Export all PDF-related utilities for the resumes zone.
 */

// PDF Parser
export { parsePdf, extractTextFromPdf, type ParsedPdf } from "./parser";

// PDF Generator
export {
  generateResumePdf,
  generatePdfFilename,
  PDFGenerationError,
} from "./generator";

// Template Analyzer
export {
  analyzeTemplateFromText,
  isValidTemplateAnalysis,
  TemplateAnalysisError,
  DEFAULT_TEMPLATE,
  type TemplateAnalysis,
  type LayoutAnalysis,
  type FontStyle,
  type FontAnalysis,
  type ColorAnalysis,
  type SpacingAnalysis,
  type SectionsAnalysis,
} from "./template-analyzer";
