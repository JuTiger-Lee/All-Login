import { Service } from "typedi";

abstract class MakeResponse<T> {
  protected code: number;
  protected message: string;
  protected response: T;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  abstract setResponse(): void;

  protected getResponse(): T {
    return this.response;
  }
}

@Service()
export class MakeSuccessResponse extends MakeResponse<{
  code: number;
  message: string;
  data: Array<object>;
}> {
  constructor(code: number, message: string) {
    super(code, message);
  }

  // @overload
  setResponse(data = []) {
    this.response = {
      code: this.code,
      message: this.message,
      data,
    };
  }
}

@Service()
export class MakeErrorResponse extends MakeResponse<Error> {
  constructor(code: number, message: string) {
    super(code, message);
  }

  // @overload
  setResponse(httpStatus = 500, err = {}, name = "Syntax Error") {
    const error = new Error();

    error["httpStatus"] = httpStatus;
    error["code"] = this.code;
    error["err"] =
      typeof err === "object" && err["stack"] ? (err = String(err)) : err;
    error.message = this.message;
    error.name = name;

    this.response = error;
  }
}
