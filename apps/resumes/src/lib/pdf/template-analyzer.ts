/**
 * Template Analyzer for PDF Resume Templates
 *
 * Analyzes uploaded PDF resumes to extract visual design properties
 * that can be used to recreate similar styling in generated PDFs.
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Layout analysis of the resume template
 */
export interface LayoutAnalysis {
  columns: 1 | 2;
  headerStyle: "centered" | "left" | "right";
  sectionSeparator: "line" | "space" | "none";
  hasPhoto: boolean;
  hasSidebar: boolean;
}

/**
 * Font style definition
 */
export interface FontStyle {
  family: string;
  size: number;
  weight: "normal" | "bold" | "light";
  color: string;
}

/**
 * Font analysis for different text types
 */
export interface FontAnalysis {
  heading: FontStyle;
  subheading: FontStyle;
  body: FontStyle;
  accent: FontStyle;
}

/**
 * Color palette extracted from template
 */
export interface ColorAnalysis {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  lineColor: string;
}

/**
 * Spacing measurements
 */
export interface SpacingAnalysis {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sectionGap: number;
  itemGap: number;
  lineHeight: number;
}

/**
 * Section order and presence
 */
export interface SectionsAnalysis {
  order: string[];
  hasIcon: boolean;
  bulletStyle: "disc" | "circle" | "square" | "dash" | "none";
}

/**
 * Complete template analysis result
 */
export interface TemplateAnalysis {
  layout: LayoutAnalysis;
  fonts: FontAnalysis;
  colors: ColorAnalysis;
  spacing: SpacingAnalysis;
  sections: SectionsAnalysis;
  confidence: number;
  analyzedAt: string;
}

// =============================================================================
// DEFAULT TEMPLATE
// =============================================================================

/**
 * Default professional template style
 * Used when analysis fails or is not available
 */
export const DEFAULT_TEMPLATE: TemplateAnalysis = {
  layout: {
    columns: 1,
    headerStyle: "left",
    sectionSeparator: "line",
    hasPhoto: false,
    hasSidebar: false,
  },
  fonts: {
    heading: {
      family: "Helvetica",
      size: 24,
      weight: "bold",
      color: "#1a1a1a",
    },
    subheading: {
      family: "Helvetica",
      size: 14,
      weight: "bold",
      color: "#333333",
    },
    body: {
      family: "Helvetica",
      size: 11,
      weight: "normal",
      color: "#444444",
    },
    accent: {
      family: "Helvetica",
      size: 10,
      weight: "normal",
      color: "#666666",
    },
  },
  colors: {
    primary: "#1a1a1a",
    secondary: "#333333",
    accent: "#0066cc",
    text: "#444444",
    background: "#ffffff",
    lineColor: "#cccccc",
  },
  spacing: {
    margins: { top: 40, right: 40, bottom: 40, left: 40 },
    sectionGap: 20,
    itemGap: 10,
    lineHeight: 1.4,
  },
  sections: {
    order: ["header", "summary", "experience", "education", "skills"],
    hasIcon: false,
    bulletStyle: "disc",
  },
  confidence: 0.5,
  analyzedAt: new Date().toISOString(),
};

// =============================================================================
// TEMPLATE ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Error thrown when template analysis fails
 */
export class TemplateAnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "TemplateAnalysisError";
  }
}

/**
 * Analyze template from extracted text structure
 *
 * This is a fallback method when image analysis is not available.
 * It infers template structure from the text content.
 *
 * @param extractedText - Raw text extracted from PDF
 * @returns Template analysis with inferred design properties
 */
export function analyzeTemplateFromText(
  extractedText: string
): TemplateAnalysis {
  // Detect sections present in the text
  const textLower = extractedText.toLowerCase();
  const detectedSections: string[] = ["header"];

  if (
    textLower.includes("summary") ||
    textLower.includes("objective") ||
    textLower.includes("profile")
  ) {
    detectedSections.push("summary");
  }
  if (
    textLower.includes("experience") ||
    textLower.includes("employment") ||
    textLower.includes("work history")
  ) {
    detectedSections.push("experience");
  }
  if (textLower.includes("education") || textLower.includes("academic")) {
    detectedSections.push("education");
  }
  if (
    textLower.includes("skills") ||
    textLower.includes("expertise") ||
    textLower.includes("competencies")
  ) {
    detectedSections.push("skills");
  }
  if (textLower.includes("project") || textLower.includes("portfolio")) {
    detectedSections.push("projects");
  }
  if (textLower.includes("certification") || textLower.includes("license")) {
    detectedSections.push("certifications");
  }
  if (
    textLower.includes("award") ||
    textLower.includes("achievement") ||
    textLower.includes("honor")
  ) {
    detectedSections.push("awards");
  }

  // Check for bullet points to infer style
  const hasDashes =
    extractedText.includes(" - ") || extractedText.includes("\n-");
  const hasBullets = extractedText.includes("•") || extractedText.includes("●");
  const bulletStyle: "disc" | "dash" | "none" = hasBullets
    ? "disc"
    : hasDashes
      ? "dash"
      : "none";

  // Check for potential multi-column layout (text with lots of horizontal spacing)
  const lines = extractedText.split("\n");
  const longGapLines = lines.filter(
    (line) => line.includes("   ") && line.trim().length > 50
  );
  const hasSidebar = longGapLines.length > 5;

  return {
    layout: {
      columns: hasSidebar ? 2 : 1,
      headerStyle: "left",
      sectionSeparator: "line",
      hasPhoto: false,
      hasSidebar,
    },
    fonts: DEFAULT_TEMPLATE.fonts,
    colors: DEFAULT_TEMPLATE.colors,
    spacing: DEFAULT_TEMPLATE.spacing,
    sections: {
      order: detectedSections,
      hasIcon: false,
      bulletStyle,
    },
    confidence: 0.4,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Validate a template analysis object
 */
export function isValidTemplateAnalysis(
  analysis: unknown
): analysis is TemplateAnalysis {
  if (!analysis || typeof analysis !== "object") return false;

  const a = analysis as Partial<TemplateAnalysis>;

  return !!(
    a.layout &&
    a.fonts &&
    a.colors &&
    a.spacing &&
    a.sections &&
    typeof a.confidence === "number" &&
    typeof a.analyzedAt === "string"
  );
}
