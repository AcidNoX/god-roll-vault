export class OAuthError extends Error {
  readonly error: string;
  readonly errorDescription?: string;
  readonly status: number;

  constructor(status: number, error: string, errorDescription?: string) {
    super(errorDescription ?? error);
    this.name = "OAuthError";
    this.status = status;
    this.error = error;
    this.errorDescription = errorDescription;
  }
}
