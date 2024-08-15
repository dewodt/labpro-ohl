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
}
