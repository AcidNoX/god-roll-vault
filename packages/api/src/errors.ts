export class BungieApiError extends Error {
  readonly errorCode: number;
  readonly errorStatus: string;
  readonly throttleSeconds: number;
  readonly messageData: Record<string, unknown>;

  constructor(
    errorCode: number,
    errorStatus: string,
    message: string,
    throttleSeconds: number,
    messageData: Record<string, unknown>,
  ) {
    super(message);
    this.name = "BungieApiError";
    this.errorCode = errorCode;
    this.errorStatus = errorStatus;
    this.throttleSeconds = throttleSeconds;
    this.messageData = messageData;
  }
}
