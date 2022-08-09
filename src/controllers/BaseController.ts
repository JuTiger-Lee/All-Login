import UserServicesable from "@/services/interfaces/UserServicesable";
import { ErrorResponseable, SuccessResponseable } from "@/utils/make-response";
import Container from "typedi";
import Context from "@/Context";

export default class BaseController extends Context {
  protected readonly userServices: UserServicesable;
  protected readonly makeErrorResponse: ErrorResponseable;
  protected readonly makeSuccessResponse: SuccessResponseable;

  constructor() {
    super();
    this.userServices = Container.get(Context.USER_SERVICES);
    this.makeErrorResponse = Container.get(Context.MAKE_ERROR_RESPONSE);
    this.makeSuccessResponse = Container.get(Context.MAKE_SUCCESS_RESPONSE);
  }
}
