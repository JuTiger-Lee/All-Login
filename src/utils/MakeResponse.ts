interface MakeResponse {
    init(code: number, message: string): void;
    response(): object;
}

class MakeSuccessResponse implements MakeResponse {
    public code: number;
    public message: string;

    init(code: number, message: string): void {
        this.code = code;
        this.message = message;
    }

    response(data = []) {
        return {
            code: this.code,
            message: this.message,
            data,
        }
    }
}

class MakeErrorResponse implements MakeResponse {
    public code: number;
    public message: string;

    init(code: number, message: string): void {
        this.code = code;
        this.message = message;
    }

    response(httpStatus = 500, err = {}, name = 'Syntax Error') {
        const error = new Error();

        error['httpStatus'] = httpStatus;
        error['code'] = this.code;
        error['err'] =
          typeof err === 'object' && err['stack'] ? (err = String(err)) : err;
        error.message = this.message;
        error.name = name;
    
        return error;
    }
}