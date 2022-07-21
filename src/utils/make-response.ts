import { Service } from "typedi";

interface ReturnResponse {
  code: number;
  message: string;
  data: Array<object>;
}

interface ReqErrorParm {
  httpStatus: number;
  err: any;
  name: string;
}

interface CommonResponseable<T> {
  init(code: number, message: string): void;
  getResponse(): T;
}

export interface ErrorResponseable extends CommonResponseable<Error> {
  setResponse(parm: ReqErrorParm): void;
}

export interface SuccessResponseable
  extends CommonResponseable<ReturnResponse> {
  setResponse(data: Array<Object>): void;
}

class MakeResponse<T> {
  protected code: number;
  protected message: string;
  protected response: T;

  init(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

  getResponse(): T {
    return this.response;
  }
}

@Service()
export class MakeSuccessResponse
  extends MakeResponse<ReturnResponse>
  implements SuccessResponseable
{
  setResponse(data = []) {
    this.response = {
      code: this.code,
      message: this.message,
      data,
    };
  }
}

/** TODO: Warning Class */
// @Service()
// export class MakeWarningResponse {
// }

@Service()
export class MakeErrorResponse
  extends MakeResponse<Error>
  implements ErrorResponseable
{
  setResponse({ httpStatus, err, name }: ReqErrorParm) {
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
