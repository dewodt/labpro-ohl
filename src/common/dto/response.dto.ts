export class ResponseDto<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T | null;

  constructor(
    status: 'success' | 'error',
    message: string,
    data: T | null = null,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  /**
   * Create a success response
   */
  static success<T>(message: string, data: T): ResponseDto<T> {
    return new ResponseDto<T>('success', message, data);
  }

  /**
   * Create an error response
   */
  static error(message: string): ResponseDto {
    return new ResponseDto('error', message);
  }
}
