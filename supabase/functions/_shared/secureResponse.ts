/**
 * Secure Response Utilities for Edge Functions
 * Provides standardized response creation with security headers
 */

import { createResponseHeaders, createCorsHeaders } from "./context.ts";

/**
 * Response payload interface
 */
interface SuccessResponse<T> {
  success: true;
  data: T;
  correlationId: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  correlationId: string;
}

/**
 * Create a successful JSON response with security headers
 */
export function createSuccessResponse<T>(
  data: T,
  correlationId: string,
  status = 200
): Response {
  const body: SuccessResponse<T> = {
    success: true,
    data,
    correlationId,
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: createResponseHeaders(correlationId),
  });
}

/**
 * Create an error JSON response with security headers
 */
export function createErrorResponse(
  error: string,
  correlationId: string,
  status = 500,
  details?: unknown
): Response {
  const body: ErrorResponse = {
    success: false,
    error,
    correlationId,
    details: details !== undefined ? details : undefined,
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: createResponseHeaders(correlationId),
  });
}

/**
 * Create a CORS preflight response
 */
export function createCorsResponse(correlationId: string): Response {
  return new Response(null, {
    status: 204,
    headers: createCorsHeaders(correlationId),
  });
}

/**
 * Standard HTTP error responses
 */
export const HttpErrors = {
  badRequest: (correlationId: string, message = "Bad request", details?: unknown) =>
    createErrorResponse(message, correlationId, 400, details),

  unauthorized: (correlationId: string, message = "Unauthorized") =>
    createErrorResponse(message, correlationId, 401),

  forbidden: (correlationId: string, message = "Forbidden") =>
    createErrorResponse(message, correlationId, 403),

  notFound: (correlationId: string, message = "Not found") =>
    createErrorResponse(message, correlationId, 404),

  methodNotAllowed: (correlationId: string, message = "Method not allowed") =>
    createErrorResponse(message, correlationId, 405),

  tooManyRequests: (correlationId: string, message = "Too many requests") =>
    createErrorResponse(message, correlationId, 429),

  internalError: (correlationId: string, message = "Internal server error") =>
    createErrorResponse(message, correlationId, 500),
};
