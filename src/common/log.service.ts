// src/common/logger/file-logger.service.ts
import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class FileLogger implements LoggerService {
  private logFilePath: string;

  constructor(filename = 'src/logs/app.log') {
    this.logFilePath = path.join(process.cwd(), filename);

    // Ensure logs directory exists
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Ensure log file exists
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, '', 'utf8');
    }
  }

  private writeLog(level: string, message: any) {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, log, 'utf8'); // Synchronous write
  }

  log(message: any) {
    console.log(message);
    this.writeLog('log', message);
  }

  error(message: any, trace?: string) {
    console.error(message, trace || '');
    this.writeLog('error', `${message} ${trace || ''}`);
  }

  warn(message: any) {
    console.warn(message);
    this.writeLog('warn', message);
  }

  debug(message: any) {
    console.debug(message);
    this.writeLog('debug', message);
  }

  verbose(message: any) {
    console.info(message);
    this.writeLog('verbose', message);
  }
}
