/**
 * @resume-maker/ai - Main Entry Point
 *
 * AI utilities for resume-maker zones including configuration,
 * JSON parsing, retry logic, and AI analysis modules for Anthropic API.
 */

// Configuration
export {
  aiProviderEnum,
  aiModelEnum,
  aiConfigSchema,
  aiFeatureFlagsSchema,
  loadAIConfig,
  loadFeatureFlags,
  getAIConfig,
  getFeatureFlags,
  isAIConfigured,
  resetAIConfigCache,
  getModelConfig,
  MODEL_CONFIGS,
  type AIProvider,
  type AIModel,
  type AIConfig,
  type AIFeatureFlags,
} from "./config";

// JSON utilities
export {
  repairJson,
  extractJsonFromResponse,
  parseAIJsonResponse,
  JSON_OUTPUT_INSTRUCTIONS,
} from "./json-utils";

// Prompts
export {
  RESUME_PARSING_SYSTEM_PROMPT,
  RESUME_TAILORING_SYSTEM_PROMPT,
  SKILL_EXTRACTION_SYSTEM_PROMPT,
  SUMMARY_GENERATION_SYSTEM_PROMPT,
  BULLET_OPTIMIZATION_SYSTEM_PROMPT,
  JOB_MATCH_ANALYSIS_SYSTEM_PROMPT,
  buildResumeParsingPrompt,
  buildResumeTailoringPrompt,
  buildSkillExtractionPrompt,
  buildSummaryGenerationPrompt,
  buildBulletOptimizationPrompt,
  buildJobMatchAnalysisPrompt,
  formatResumeForPrompt,
  type JobMatchAnalysisResult,
  type SkillExtractionResult,
} from "./prompts";

// Resume Parser
export {
  parseResumeText,
  hasValidContent,
  ResumeParseError,
} from "./resume-parser";

// Retry utilities
export {
  withRetry,
  createRetryWrapper,
  DEFAULT_RETRY_CONFIG,
  getRetryConfig,
  loadRetryConfig,
  resetRetryConfigCache,
  isTransientError,
  getRetryAfterMs,
  getErrorCode,
  enhanceError,
  hasRetryMetadata,
  getUserFriendlyMessage,
  calculateDelay,
  delay,
  logRetryEvent,
  createRetryLogger,
  type RetryOptions,
  type RetryConfig,
  type RetryEvent,
} from "./retry";

// AI Modules - Company Research
export {
  researchCompany,
  CompanyResearchError,
  COMPANY_RESEARCH_SYSTEM_PROMPT,
  buildCompanyResearchPrompt,
} from "./company";

// AI Modules - Context Alignment
export {
  analyzeContext,
  ContextError,
  CONTEXT_SYSTEM_PROMPT,
  buildContextPrompt,
  type JobData,
} from "./context";

// AI Modules - Impact Quantification
export {
  analyzeImpact,
  ImpactError,
  IMPACT_SYSTEM_PROMPT,
  buildImpactPrompt,
} from "./impact";

// AI Modules - Soft Skills Assessment
export {
  startAssessment,
  continueAssessment,
  SoftSkillsError,
  SOFT_SKILLS_SYSTEM_PROMPT,
  buildStartAssessmentPrompt,
  buildChatPrompt,
} from "./soft-skills";

// AI Modules - Uniqueness Analysis
export {
  analyzeUniqueness,
  UniquenessError,
  UNIQUENESS_SYSTEM_PROMPT,
  buildUniquenessPrompt,
} from "./uniqueness";

// AI Modules - Resume Tailoring
export {
  tailorResume,
  TailorError,
  tailorRequestSchema,
  type TailorRequest,
  type TailorResponse,
  type TailorChangeSummary,
  type TailorRequestInput,
} from "./tailor";

// Tailoring Types
export {
  RECRUITER_ISSUES,
  type RecruiterIssue,
  type CompanyResearchResult,
  type SoftSkillAssessment,
  type PreAnalysisResult,
  type StrategicTone,
  type RuleCondition,
  type TransformActionType,
  type TransformTarget,
  type TransformationAction,
  type TransformationRule,
  type RuleEvaluationResult,
  type BulletTransformInstruction,
  type SummaryTransformInstruction,
  type WhyFitInstruction,
  type SkillsReorderInstruction,
  type ExperienceReorderInstruction,
  type TransformationInstructions,
  type DimensionScore,
  type RecruiterReadinessScore,
  type TailoringChanges,
  type HybridTailorResult,
  type BulletTemplate,
  type SummaryTemplate,
} from "./tailoring/types";

// Scoring
export {
  calculateRecruiterReadiness,
  getScoreSummary,
  getMostImpactfulImprovement,
  DIMENSION_WEIGHTS,
  SCORE_THRESHOLDS,
  getScoreLabel,
  getReadableLabel,
  getScoreColor,
  getScoreBgColor,
  getScoreBorderColor,
  getDimensionColor,
  getProgressColor,
  getScoreEmoji,
  DIMENSION_DISPLAY_NAMES,
} from "./scoring";
