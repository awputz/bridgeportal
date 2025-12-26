/**
 * Structured Logger for Edge Functions
 * Provides JSON logging with correlation IDs, log levels, and automatic context
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  correlationId: string;
  functionName: string;
  userId?: string;
  userEmail?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId: string;
  functionName: string;
  userId?: string;
  durationMs?: number;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  metadata?: Record<string, unknown>;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

// Default minimum log level (can be overridden via env)
const MIN_LOG_LEVEL: LogLevel = (Deno.env.get('LOG_LEVEL') as LogLevel) || 'info';

export class Logger {
  private context: LogContext;
  private startTime: number;

  constructor(context: LogContext) {
    this.context = context;
    this.startTime = Date.now();
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LOG_LEVEL];
  }

  private formatEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId: this.context.correlationId,
      functionName: this.context.functionName,
      durationMs: Date.now() - this.startTime,
    };

    if (this.context.userId) {
      entry.userId = this.context.userId;
    }

    if (metadata && Object.keys(metadata).length > 0) {
      entry.metadata = metadata;
    }

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack,
        code: (error as Error & { code?: string }).code,
      };
    }

    return entry;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.formatEntry(level, message, metadata, error);
    const jsonLog = JSON.stringify(entry);

    switch (level) {
      case 'debug':
      case 'info':
        console.log(jsonLog);
        break;
      case 'warn':
        console.warn(jsonLog);
        break;
      case 'error':
      case 'fatal':
        console.error(jsonLog);
        break;
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('error', message, metadata, error);
  }

  fatal(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('fatal', message, metadata, error);
  }

  /**
   * Log request start
   */
  requestStart(method: string, path: string, metadata?: Record<string, unknown>): void {
    this.info(`${method} ${path} - Request started`, metadata);
  }

  /**
   * Log request completion with duration
   */
  requestEnd(method: string, path: string, status: number, metadata?: Record<string, unknown>): void {
    const duration = Date.now() - this.startTime;
    this.info(`${method} ${path} - Request completed`, {
      status,
      durationMs: duration,
      ...metadata,
    });
  }

  /**
   * Get the correlation ID for this logger instance
   */
  getCorrelationId(): string {
    return this.context.correlationId;
  }

  /**
   * Get duration since logger creation
   */
  getDuration(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: Partial<LogContext>): Logger {
    return new Logger({
      ...this.context,
      ...additionalContext,
    });
  }
}

/**
 * Create a new logger instance for an edge function
 */
export function createLogger(functionName: string, correlationId?: string): Logger {
  return new Logger({
    functionName,
    correlationId: correlationId || crypto.randomUUID(),
  });
}
