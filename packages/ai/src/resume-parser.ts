/**
 * Resume Parser - AI-powered resume text extraction
 *
 * Uses Anthropic Claude to parse raw resume text into structured content.
 */

import Anthropic from "@anthropic-ai/sdk";
import { getAIConfig, getModelConfig, isAIConfigured } from "./config";
import {
  RESUME_PARSING_SYSTEM_PROMPT,
  buildResumeParsingPrompt,
} from "./prompts";
import { withRetry, hasRetryMetadata } from "./retry";
import { extractJsonFromResponse } from "./json-utils";
import { resumeContentSchema, type ResumeContent } from "@resume-maker/types";

/**
 * Error thrown when resume parsing fails
 */
export class ResumeParseError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "ResumeParseError";
  }
}

/**
 * Create Anthropic client with current configuration
 */
function createClient(): Anthropic {
  const config = getAIConfig();
  return new Anthropic({
    apiKey: config.apiKey,
    timeout: config.timeout,
  });
}

/**
 * Parse extracted resume text into structured ResumeContent using AI
 * @param extractedText - Raw text extracted from PDF
 * @returns Parsed resume content
 */
export async function parseResumeText(
  extractedText: string
): Promise<ResumeContent> {
  // Check if AI is configured
  if (!isAIConfigured()) {
    throw new ResumeParseError(
      "AI is not configured. Please set your API key.",
      "AI_NOT_CONFIGURED"
    );
  }

  // Validate we have text to parse
  if (!extractedText || extractedText.trim().length < 50) {
    throw new ResumeParseError(
      "Extracted text is too short to parse as a resume.",
      "INSUFFICIENT_TEXT"
    );
  }

  const modelConfig = getModelConfig("resumeParsing");
  const userPrompt = buildResumeParsingPrompt(extractedText);

  try {
    const client = createClient();

    const response = await withRetry(
      () =>
        client.messages.create({
          model: modelConfig.model,
          max_tokens: 4000,
          temperature: 0.1, // Low temperature for consistent parsing
          system: RESUME_PARSING_SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: userPrompt,
            },
          ],
        }),
      { timeBudgetMs: 170000 } // 170s budget (10s buffer for Vercel 180s limit)
    );

    // Extract text content
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new ResumeParseError(
        "No response received from AI",
        "EMPTY_RESPONSE"
      );
    }

    // Parse JSON from response
    const jsonText = extractJsonFromResponse(textContent.text);
    let parsedContent: unknown;

    try {
      parsedContent = JSON.parse(jsonText);
    } catch {
      throw new ResumeParseError("AI returned invalid JSON", "INVALID_JSON");
    }

    // Validate against schema with defaults for optional fields
    const result = resumeContentSchema.safeParse(parsedContent);

    if (!result.success) {
      // Try to salvage what we can with defaults
      const salvaged = {
        contact: {
          name:
            (parsedContent as Record<string, unknown>)?.contact &&
            typeof (parsedContent as Record<string, { name?: string }>).contact
              ?.name === "string"
              ? (parsedContent as Record<string, { name: string }>).contact.name
              : "",
          email:
            (parsedContent as Record<string, unknown>)?.contact &&
            typeof (parsedContent as Record<string, { email?: string }>).contact
              ?.email === "string"
              ? (parsedContent as Record<string, { email: string }>).contact
                  .email
              : "",
        },
        experiences: Array.isArray(
          (parsedContent as Record<string, unknown>)?.experiences
        )
          ? (parsedContent as Record<string, unknown[]>).experiences
          : [],
        education: Array.isArray(
          (parsedContent as Record<string, unknown>)?.education
        )
          ? (parsedContent as Record<string, unknown[]>).education
          : [],
        skills: (() => {
          const pc = parsedContent as {
            skills?: { technical?: string[]; soft?: string[] };
          };
          return {
            technical: Array.isArray(pc?.skills?.technical)
              ? pc.skills.technical
              : [],
            soft: Array.isArray(pc?.skills?.soft) ? pc.skills.soft : [],
          };
        })(),
        summary:
          typeof (parsedContent as Record<string, unknown>)?.summary ===
          "string"
            ? (parsedContent as Record<string, string>).summary
            : undefined,
        projects: Array.isArray(
          (parsedContent as Record<string, unknown>)?.projects
        )
          ? (parsedContent as Record<string, unknown[]>).projects
          : undefined,
      };

      const salvagedResult = resumeContentSchema.safeParse(salvaged);
      if (salvagedResult.success) {
        return salvagedResult.data;
      }

      throw new ResumeParseError(
        "AI response does not match expected resume format",
        "SCHEMA_VALIDATION_FAILED"
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ResumeParseError) {
      throw error;
    }

    // Check for retry-exhausted errors
    if (hasRetryMetadata(error)) {
      const metadata = (
        error as {
          retryMetadata: {
            attempts: number;
            exhaustedRetries: boolean;
            errorCode: string;
          };
        }
      ).retryMetadata;
      throw new ResumeParseError(
        `AI request failed after ${metadata.attempts} attempt(s)`,
        metadata.exhaustedRetries ? "MAX_RETRIES_EXCEEDED" : metadata.errorCode,
        error
      );
    }

    if (error instanceof Anthropic.APIError) {
      throw new ResumeParseError(
        `AI API error: ${error.message}`,
        "API_ERROR",
        error
      );
    }

    throw new ResumeParseError(
      "Failed to parse resume with AI",
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * Check if the parsed content has meaningful data
 */
export function hasValidContent(content: ResumeContent): boolean {
  const hasExperiences = Boolean(
    content.experiences && content.experiences.length > 0
  );
  const hasSkills = Boolean(
    content.skills?.technical && content.skills.technical.length > 0
  );
  const hasEducation = Boolean(
    content.education && content.education.length > 0
  );
  const hasProjects = Boolean(content.projects && content.projects.length > 0);

  // Resume should have at least experiences or skills or projects
  return hasExperiences || hasSkills || hasEducation || hasProjects;
}
