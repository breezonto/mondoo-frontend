// 日志工具类
import config from '@/config';

// 日志级别
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

class Logger {
  private enabled: boolean;
  private level: number;

  constructor() {
    this.enabled = config.log.enabled;
    this.level = LOG_LEVELS[config.log.level as keyof typeof LOG_LEVELS] ?? LOG_LEVELS.debug;
  }

  /**
   * 调试日志
   */
  debug(...args: any[]) {
    if (this.enabled && this.level <= LOG_LEVELS.debug) {
      console.log(...args);
    }
  }

  /**
   * 信息日志
   */
  info(...args: any[]) {
    if (this.enabled && this.level <= LOG_LEVELS.info) {
      console.log(...args);
    }
  }

  /**
   * 警告日志
   */
  warn(...args: any[]) {
    if (this.enabled && this.level <= LOG_LEVELS.warn) {
      console.warn(...args);
    }
  }

  /**
   * 错误日志
   */
  error(...args: any[]) {
    if (this.enabled && this.level <= LOG_LEVELS.error) {
      console.error(...args);
    }
  }

  /**
   * 启用日志
   */
  enable() {
    this.enabled = true;
  }

  /**
   * 禁用日志
   */
  disable() {
    this.enabled = false;
  }

  /**
   * 设置日志级别
   */
  setLevel(level: string) {
    this.level = LOG_LEVELS[level as keyof typeof LOG_LEVELS] ?? LOG_LEVELS.debug;
  }
}

// 导出单例
export default new Logger();