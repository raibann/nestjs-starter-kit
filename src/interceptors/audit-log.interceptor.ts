import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from 'src/common/audit_log/audit_log.service';
import { Reflector } from '@nestjs/core';

export const AUDIT_LOG_META = 'auditLog';
export const AuditLog = (meta: Record<string, any>) =>
  SetMetadata(AUDIT_LOG_META, meta);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Intercepts the request and formats the response.
   * This handles the success case, wrapping the original data.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditLog = this.reflector.get<string>(
      AUDIT_LOG_META,
      context.getHandler(),
    );
    if (!auditLog) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const { ip, method, url } = request;
    const userId = request['user']?.userId;
    const sessionId = request['user']?.sessionId;
    const userAgent = request.headers['user-agent'];

    // console.table({
    //   userId,
    //   sessionId,
    //   ip,
    //   method,
    //   url,
    //   userAgent,
    // });

    // We use the `map` operator to transform the data returned by the route handler.
    return next.handle().pipe(
      tap(async (res) => {
        const { action } = auditLog as any;
        try {
          await this.auditLogService.createAuditLog({
            userId: url.includes('login') ? res.userId : userId,
            action,
            data: {
              ...res,
              ip,
              method,
              url,
              userAgent,
              sessionId,
            },
          });
          this.logger.log('Audit log created successfully');
        } catch (error) {
          this.logger.error('Failed to create audit log', error);
        }
      }),
    );
  }
}
