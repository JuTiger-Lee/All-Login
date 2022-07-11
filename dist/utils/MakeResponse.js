class MakeSuccessResponse {
    init(code, message) {
        this.code = code;
        this.message = message;
    }
    response(data = []) {
        return {
            code: this.code,
            message: this.message,
            data,
        };
    }
}
class MakeErrorResponse {
    init(code, message) {
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
//# sourceMappingURL=MakeResponse.js.map