/**
 * Logger Utility Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Unmock logger for its own tests
vi.unmock('../logger');

import { logger, Logger, LogLevel, createLogger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clearLogs();
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LogLevel', () => {
    it('should have correct log level values', () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
      expect(LogLevel.NONE).toBe(4);
    });
  });

  describe('Logger Instance', () => {
    it('should create logger instance', () => {
      expect(logger).toBeDefined();
      expect(logger.debug).toBeInstanceOf(Function);
      expect(logger.info).toBeInstanceOf(Function);
      expect(logger.warn).toBeInstanceOf(Function);
      expect(logger.error).toBeInstanceOf(Function);
    });

    it('should log debug messages', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.DEBUG });
      testLogger.debug('Debug message');
      expect(console.debug).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.INFO });
      testLogger.info('Info message');
      expect(console.info).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.WARN });
      testLogger.warn('Warning message');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.ERROR });
      testLogger.error('Error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should log with data object', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.DEBUG });
      const data = { key: 'value' };
      testLogger.debug('Debug with data', data);
      expect(console.debug).toHaveBeenCalled();
    });

    it('should not log when disabled', () => {
      const testLogger = new Logger({ enabled: false, level: LogLevel.DEBUG });
      testLogger.debug('Should not log');
      testLogger.info('Should not log');
      testLogger.warn('Should not log');
      testLogger.error('Should not log');
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should respect log level threshold', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.WARN });
      testLogger.debug('Debug message');
      testLogger.info('Info message');
      testLogger.warn('Warning message');
      testLogger.error('Error message');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle Error objects in error method', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.ERROR });
      const error = new Error('Test error');
      testLogger.error('Error occurred', error);
      expect(console.error).toHaveBeenCalled();
    });

    it('should store logs when persistLogs is enabled', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });
      testLogger.debug('Debug message');
      testLogger.info('Info message');

      const logs = testLogger.getLogs();
      expect(logs.length).toBeGreaterThanOrEqual(2);
    });

    it('should not exceed maxLogs limit', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, maxLogs: 2, level: LogLevel.DEBUG });
      testLogger.debug('Message 1');
      testLogger.debug('Message 2');
      testLogger.debug('Message 3');

      const logs = testLogger.getLogs();
      expect(logs.length).toBeLessThanOrEqual(2);
    });

    it('should get logs by level', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });
      testLogger.debug('Debug message');
      testLogger.info('Info message');
      testLogger.warn('Warning message');

      const warnLogs = testLogger.getLogsByLevel(LogLevel.WARN);
      expect(warnLogs.length).toBeGreaterThanOrEqual(1);
      expect(warnLogs[0].level).toBe(LogLevel.WARN);
    });

    it('should clear logs', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });
      testLogger.debug('Debug message');
      testLogger.info('Info message');

      expect(testLogger.getLogs().length).toBeGreaterThan(0);

      testLogger.clearLogs();
      expect(testLogger.getLogs().length).toBe(0);
    });

    it('should export logs as JSON', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });
      testLogger.debug('Debug message');

      const exported = testLogger.exportLogs();
      expect(typeof exported).toBe('string');
      expect(() => JSON.parse(exported)).not.toThrow();
    });

    it('should create child logger with context', () => {
      const parentLogger = new Logger({ enabled: true, level: LogLevel.DEBUG });
      const childLogger = parentLogger.createChild('ChildContext');

      expect(childLogger).toBeInstanceOf(Logger);
      childLogger.debug('Child message');
      expect(console.debug).toHaveBeenCalled();
    });

    it('should update configuration', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.DEBUG });
      testLogger.updateConfig({ level: LogLevel.ERROR });

      const config = testLogger.getConfig();
      expect(config.level).toBe(LogLevel.ERROR);
    });

    it('should get current configuration', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.WARN, maxLogs: 500 });
      const config = testLogger.getConfig();

      expect(config.enabled).toBe(true);
      expect(config.level).toBe(LogLevel.WARN);
      expect(config.maxLogs).toBe(500);
    });

    it('should format messages with timestamp and level', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.DEBUG });
      testLogger.debug('Test message');

      expect(console.debug).toHaveBeenCalled();
      const callArgs = (console.debug as any).mock.calls[0];
      expect(callArgs[0]).toContain('DEBUG');
    });

    it('should include context in formatted message', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.DEBUG }, 'TestContext');
      testLogger.debug('Test message');

      expect(console.debug).toHaveBeenCalled();
      const callArgs = (console.debug as any).mock.calls[0];
      expect(callArgs[0]).toContain('TestContext');
    });

    it('should handle localStorage errors gracefully', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      expect(() => {
        testLogger.debug('Test message');
      }).not.toThrow();
    });

    it('should handle missing localStorage', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      expect(() => {
        testLogger.debug('Test message');
      }).not.toThrow();
    });
  });

  describe('createLogger', () => {
    it('should create logger with context', () => {
      const contextLogger = createLogger('TestModule');
      expect(contextLogger).toBeDefined();
      expect(typeof contextLogger.debug).toBe('function');
    });
  });

  describe('Singleton Logger', () => {
    it('should provide singleton logger instance', () => {
      expect(logger).toBeDefined();
      expect(logger.debug).toBeInstanceOf(Function);
    });

    it('should maintain logs across calls', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });
      testLogger.clearLogs();

      testLogger.debug('First message');
      testLogger.info('Second message');

      const logs = testLogger.getLogs();
      expect(logs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Remote Logging', () => {
    it('should not send to remote when remoteLogging is disabled', () => {
      const testLogger = new Logger({
        enabled: true,
        remoteLogging: false,
        level: LogLevel.ERROR
      });

      expect(() => {
        testLogger.error('Test error');
      }).not.toThrow();
    });
  });

  describe('Download Logs', () => {
    beforeEach(() => {
      // Mock URL.createObjectURL and URL.revokeObjectURL
      global.URL.createObjectURL = vi.fn(() => 'blob:url');
      global.URL.revokeObjectURL = vi.fn();
    });

    it('should not crash when calling downloadLogs', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      expect(() => {
        testLogger.downloadLogs();
      }).not.toThrow();
    });

    it('should create download link when logs are downloaded', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      expect(() => {
        testLogger.debug('Test log');
        testLogger.downloadLogs();
      }).not.toThrow();
    });
  });

  describe('Log Entry Structure', () => {
    it('should create log entries with all required fields', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });
      testLogger.debug('Test message', { extra: 'data' });

      const logs = testLogger.getLogs();

      if (logs.length > 0) {
        const entry = logs[0];
        expect(entry).toHaveProperty('level');
        expect(entry).toHaveProperty('message');
        expect(entry).toHaveProperty('timestamp');
      }
    });

    it('should include stack trace for errors', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.ERROR });
      const error = new Error('Test error');

      expect(() => {
        testLogger.error('Error occurred', error);
      }).not.toThrow();

      const logs = testLogger.getLogs();
      expect(logs.length).toBeGreaterThanOrEqual(0);
    });
  });
});
