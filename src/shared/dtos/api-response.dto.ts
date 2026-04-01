export class ApiResponseDto<T> {
  public message: string;
  public data: T;

  constructor(data: T, message: string = 'Successful') {
    this.message = message;
    this.data = data;
  }
}
