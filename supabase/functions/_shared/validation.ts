/**
 * Input Validation Utilities for Edge Functions
 * Uses zod for schema validation
 */

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public details: unknown;
  
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

/**
 * Validate request body against a zod schema
 * Throws ValidationError if validation fails
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    
    throw new ValidationError(
      "Validation failed",
      formattedErrors
    );
  }
  
  return result.data;
}

/**
 * Common validation schemas for reuse
 */
export const commonSchemas = {
  // UUID validation
  uuid: z.string().uuid("Invalid UUID format"),
  
  // Email validation
  email: z.string().email("Invalid email format").max(255),
  
  // Phone validation (E.164 format)
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format"),
  
  // Non-empty string with max length
  nonEmptyString: (maxLength = 1000) =>
    z.string().min(1, "Cannot be empty").max(maxLength),
  
  // Optional string with max length
  optionalString: (maxLength = 1000) =>
    z.string().max(maxLength).optional().nullable(),
  
  // Positive number
  positiveNumber: z.number().positive("Must be positive"),
  
  // Date string (ISO format)
  dateString: z.string().datetime({ message: "Invalid date format" }),
  
  // Pagination params
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
  }),
};

/**
 * Parse and validate JSON body from request
 */
export async function parseAndValidate<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  let body: unknown;
  
  try {
    body = await req.json();
  } catch {
    throw new ValidationError("Invalid JSON body");
  }
  
  return validateRequest(schema, body);
}

/**
 * Create error response for validation errors
 */
export function validationErrorResponse(
  error: ValidationError,
  correlationId: string,
  headers: HeadersInit
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: error.message,
      details: error.details,
      correlationId,
    }),
    {
      status: 400,
      headers,
    }
  );
}
