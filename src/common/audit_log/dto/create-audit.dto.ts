export class CreateAuditDto {
  userId: string;
  sessionId: string;
  ip: string;
  method: string;
  url: string;
}
