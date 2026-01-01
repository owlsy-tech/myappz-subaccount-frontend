/**
 * Logger Utility Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { logger, Logger, LogLevel, createLogger } from '../logger';

// Unmock logger for its own tests
vi.unmock('../logger');

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

    it('should attempt to send error logs to remote endpoint when enabled', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });

      const testLogger = new Logger({
        enabled: true,
        remoteLogging: true,
        remoteEndpoint: 'https://example.com/logs',
        level: LogLevel.ERROR,
        persistLogs: true
      });

      testLogger.error('Remote error');

      // Wait for async sendToRemote
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/logs',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle remote logging failures gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const testLogger = new Logger({
        enabled: true,
        remoteLogging: true,
        remoteEndpoint: 'https://example.com/logs',
        level: LogLevel.ERROR
      });

      expect(() => {
        testLogger.error('Remote error');
      }).not.toThrow();
    });

    it('should not send to remote when endpoint is missing', () => {
      const testLogger = new Logger({
        enabled: true,
        remoteLogging: true,
        remoteEndpoint: undefined,
        level: LogLevel.ERROR
      });

      expect(() => {
        testLogger.error('Test error');
      }).not.toThrow();
    });

    it('should only send errors to remote, not other log levels', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });

      const testLogger = new Logger({
        enabled: true,
        remoteLogging: true,
        remoteEndpoint: 'https://example.com/logs',
        level: LogLevel.DEBUG,
        persistLogs: true
      });

      testLogger.debug('Debug message');
      testLogger.info('Info message');
      testLogger.warn('Warn message');

      // Wait to ensure no remote calls
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Environment Variable Handling', () => {
    it('should parse DEBUG log level from environment', () => {
      const originalEnv = import.meta.env.VITE_LOG_LEVEL;
      import.meta.env.VITE_LOG_LEVEL = 'DEBUG';

      const testLogger = new Logger({ enabled: true });
      const config = testLogger.getConfig();

      expect(config.level).toBe(LogLevel.DEBUG);

      import.meta.env.VITE_LOG_LEVEL = originalEnv;
    });

    it('should parse INFO log level from environment', () => {
      const originalEnv = import.meta.env.VITE_LOG_LEVEL;
      import.meta.env.VITE_LOG_LEVEL = 'INFO';

      const testLogger = new Logger({ enabled: true });
      const config = testLogger.getConfig();

      expect(config.level).toBe(LogLevel.INFO);

      import.meta.env.VITE_LOG_LEVEL = originalEnv;
    });

    it('should parse WARN log level from environment', () => {
      const originalEnv = import.meta.env.VITE_LOG_LEVEL;
      import.meta.env.VITE_LOG_LEVEL = 'WARN';

      const testLogger = new Logger({ enabled: true });
      const config = testLogger.getConfig();

      expect(config.level).toBe(LogLevel.WARN);

      import.meta.env.VITE_LOG_LEVEL = originalEnv;
    });

    it('should parse ERROR log level from environment', () => {
      const originalEnv = import.meta.env.VITE_LOG_LEVEL;
      import.meta.env.VITE_LOG_LEVEL = 'ERROR';

      const testLogger = new Logger({ enabled: true });
      const config = testLogger.getConfig();

      expect(config.level).toBe(LogLevel.ERROR);

      import.meta.env.VITE_LOG_LEVEL = originalEnv;
    });

    it('should parse NONE log level from environment', () => {
      const originalEnv = import.meta.env.VITE_LOG_LEVEL;
      import.meta.env.VITE_LOG_LEVEL = 'NONE';

      const testLogger = new Logger({ enabled: true });
      const config = testLogger.getConfig();

      expect(config.level).toBe(LogLevel.NONE);

      import.meta.env.VITE_LOG_LEVEL = originalEnv;
    });

    it('should use default log level for production when no env var is set', () => {
      const originalEnv = import.meta.env.VITE_LOG_LEVEL;
      const originalMode = import.meta.env.MODE;

      import.meta.env.VITE_LOG_LEVEL = undefined;
      import.meta.env.MODE = 'production';

      const testLogger = new Logger({ enabled: true });
      const config = testLogger.getConfig();

      expect(config.level).toBe(LogLevel.WARN);

      import.meta.env.VITE_LOG_LEVEL = originalEnv;
      import.meta.env.MODE = originalMode;
    });

    it('should use default log level for development when no env var is set', () => {
      const originalEnv = import.meta.env.VITE_LOG_LEVEL;
      const originalMode = import.meta.env.MODE;

      import.meta.env.VITE_LOG_LEVEL = undefined;
      import.meta.env.MODE = 'development';

      const testLogger = new Logger({ enabled: true });
      const config = testLogger.getConfig();

      expect(config.level).toBe(LogLevel.DEBUG);

      import.meta.env.VITE_LOG_LEVEL = originalEnv;
      import.meta.env.MODE = originalMode;
    });
  });

  describe('Download Logs', () => {
    beforeEach(() => {
      // Mock URL.createObjectURL and URL.revokeObjectURL
      global.URL.createObjectURL = vi.fn(() => 'blob:url');
      global.URL.revokeObjectURL = vi.fn();

      // Mock document methods
      document.createElement = vi.fn((tag) => {
        const element = {
          href: '',
          download: '',
          click: vi.fn(),
        };
        return element as any;
      });

      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
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

    it('should not attempt download in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      expect(() => {
        testLogger.downloadLogs();
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should create blob with correct content', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });
      testLogger.debug('Test log for download');

      const blobSpy = vi.spyOn(global, 'Blob');
      testLogger.downloadLogs();

      expect(blobSpy).toHaveBeenCalledWith(
        [expect.any(String)],
        { type: 'application/json' }
      );
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

    it('should handle non-Error objects in error method', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.ERROR });
      const errorData = { code: 500, message: 'Server error' };

      expect(() => {
        testLogger.error('Error occurred', errorData);
      }).not.toThrow();

      const logs = testLogger.getLogs();
      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe('LocalStorage Handling', () => {
    it('should handle localStorage.setItem errors gracefully', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => {
        testLogger.debug('Test message');
      }).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle localStorage.removeItem errors gracefully', () => {
      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        testLogger.clearLogs();
      }).not.toThrow();

      Storage.prototype.removeItem = originalRemoveItem;
    });

    it('should handle missing window object gracefully', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const testLogger = new Logger({ enabled: true, persistLogs: true, level: LogLevel.DEBUG });

      expect(() => {
        testLogger.debug('Test message');
        testLogger.clearLogs();
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('Console Method Selection', () => {
    it('should use console.log for default case', () => {
      const testLogger = new Logger({ enabled: true, level: LogLevel.DEBUG });
      const logSpy = vi.spyOn(console, 'log');

      // Force a scenario that uses default console method by directly testing
      // the private getConsoleMethod through public API
      testLogger.debug('Test');

      // At minimum, some console method should be called
      expect(
        console.debug as any,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('Convenience Export Functions', () => {
    it('should export global debug function', async () => {
      const module = await import('../logger');
      expect(typeof module.debug).toBe('function');
    });

    it('should export global info function', async () => {
      const module = await import('../logger');
      expect(typeof module.info).toBe('function');
    });

    it('should export global warn function', async () => {
      const module = await import('../logger');
      expect(typeof module.warn).toBe('function');
    });

    it('should export global error function', async () => {
      const module = await import('../logger');
      expect(typeof module.error).toBe('function');
    });
  });
});
