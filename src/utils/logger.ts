/**
 * Logger Utility
 * Centralized logging system with different log levels and environment-aware output
 */

/* eslint-disable class-methods-use-this, no-console, no-void, @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-shadow */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface ILogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: unknown;
  stack?: string;
  context?: string;
}

export interface ILoggerConfig {
  level: LogLevel;
  enabled: boolean;
  persistLogs: boolean;
  maxLogs: number;
  remoteLogging: boolean;
  remoteEndpoint?: string;
}

class Logger {
  private config: ILoggerConfig;

  private logs: ILogEntry[] = [];

  private context?: string;

  constructor(config: Partial<ILoggerConfig> = {}, context?: string) {
    this.config = {
      level: this.getLogLevelFromEnv(),
      enabled: import.meta.env.MODE !== 'test',
      persistLogs: import.meta.env.MODE === 'development',
      maxLogs: 1000,
      remoteLogging: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
      remoteEndpoint: import.meta.env.VITE_ERROR_REPORTING_ENDPOINT,
      ...config,
    };
    this.context = context;
  }

  /**
   * Get log level from environment variable
   */
  private getLogLevelFromEnv(): LogLevel {
    const envLevel = import.meta.env.VITE_LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'INFO':
        return LogLevel.INFO;
      case 'WARN':
        return LogLevel.WARN;
      case 'ERROR':
        return LogLevel.ERROR;
      case 'NONE':
        return LogLevel.NONE;
      default:
        return import.meta.env.MODE === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
    }
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.level;
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = this.context ? `[${this.context}]` : '';
    return `[${timestamp}] ${levelName} ${contextStr}: ${message}`;
  }

  /**
   * Get console method based on log level
   */
  private getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug.bind(console);
      case LogLevel.INFO:
        return console.info.bind(console);
      case LogLevel.WARN:
        return console.warn.bind(console);
      case LogLevel.ERROR:
        return console.error.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  /**
   * Create log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
    stack?: string
  ): ILogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      data,
      stack,
      context: this.context,
    };
  }

  /**
   * Store log entry
   */
  private storeLog(entry: ILogEntry): void {
    if (this.config.persistLogs) {
      this.logs.push(entry);

      // Limit stored logs
      if (this.logs.length > this.config.maxLogs) {
        this.logs.shift();
      }

      // Store in localStorage for debugging
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const recentLogs = this.logs.slice(-100);
          localStorage.setItem('app_logs', JSON.stringify(recentLogs));
        } catch (error) {
          // Ignore localStorage errors
        }
      }
    }
  }

  /**
   * Send log to remote endpoint
   */
  private async sendToRemote(entry: ILogEntry): Promise<void> {
    if (!this.config.remoteLogging || !this.config.remoteEndpoint) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silently fail remote logging
    }
  }

  /**
   * Log message with specified level
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message);
    const consoleMethod = this.getConsoleMethod(level);

    // Output to console
    if (data !== undefined) {
      consoleMethod(formattedMessage, data);
    } else {
      consoleMethod(formattedMessage);
    }

    // Create and store log entry
    const entry = this.createLogEntry(level, message, data);
    this.storeLog(entry);

    // Send to remote if error
    if (level === LogLevel.ERROR && this.config.remoteLogging) {
      void this.sendToRemote(entry);
    }
  }

  /**
   * Debug log
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Info log
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Warning log
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Error log
   */
  error(message: string, error?: Error | unknown): void {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error;

    this.log(LogLevel.ERROR, message, errorData);
  }

  /**
   * Get all stored logs
   */
  getLogs(): ILogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): ILogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('app_logs');
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const logsJson = this.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `app-logs-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Create a child logger with context
   */
  createChild(context: string): Logger {
    return new Logger(this.config, context);
  }

  /**
   * Update logger configuration
   */
  updateConfig(config: Partial<ILoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ILoggerConfig {
    return { ...this.config };
  }
}

/**
 * Create singleton logger instance
 */
export const logger = new Logger();

/**
 * Create logger with context
 */
export const createLogger = (context: string): Logger => {
  return logger.createChild(context);
};

/**
 * Export Logger class for custom instances
 */
export { Logger };

/**
 * Convenience methods for global usage
 */
export const debug = (message: string, data?: unknown): void => logger.debug(message, data);
export const info = (message: string, data?: unknown): void => logger.info(message, data);
export const warn = (message: string, data?: unknown): void => logger.warn(message, data);
export const error = (message: string, error?: Error | unknown): void =>
  logger.error(message, error);
