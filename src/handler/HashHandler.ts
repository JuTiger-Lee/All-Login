import crypto from "crypto";
import bcrypt from "bcrypt";
import Container from "typedi";
import jwt from "jsonwebtoken";
import { ErrorResponseable } from "@/utils/make-response";
import Context from "@/Context";

export default class HashHanlder {
  makeErrorResponse: ErrorResponseable;

  constructor() {
    this.makeErrorResponse = Container.get(Context.MAKE_ERROR_RESPONSE);
    this.makeErrorResponse.init(500, "Hash Handler Error");
  }

  private getCryptoHash(hash: string): string {
    return crypto.createHash("sha256").update(hash).digest("base64");
  }

  getDecodeToken(encryptToken: string) {
    const token = encryptToken && encryptToken.split(" ")[1];

    return jwt.decode(token);
  }

  compare(dbPassword: string, comparePassword: string): boolean {
    try {
      const hashPassword = this.getHash(dbPassword);

      return bcrypt.compareSync(hashPassword, comparePassword);
    } catch (err) {
      this.makeErrorResponse.setResponse({
        err,
        httpStatus: 500,
        name: "Hash Compare Error",
      });
      throw this.makeErrorResponse.getResponse();
    }
  }

  getHash(hash: string): string {
    try {
      const resultHash = this.getCryptoHash(hash);

      return bcrypt.hashSync(resultHash, 10);
    } catch (err) {
      this.makeErrorResponse.setResponse({
        err,
        httpStatus: 500,
        name: "Hash Encrypt Error",
      });
      throw this.makeErrorResponse.getResponse();
    }
  }
}
