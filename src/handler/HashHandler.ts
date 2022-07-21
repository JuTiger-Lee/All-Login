import crypto from "crypto";
import bcrypt from "bcrypt";
import { Inject, Service } from "typedi";
import { ErrorResponseable } from "@/utils/make-response";

@Service()
export default class HashHanlder {
  constructor(
    @Inject("MakeErrorResponse")
    private readonly makeErrorResponse: ErrorResponseable
  ) {
    this.makeErrorResponse.init(500, "Hash Handler Error");
  }

  private getCryptoHash(hash: string): string {
    return crypto.createHash("sha256").update(hash).digest("base64");
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
