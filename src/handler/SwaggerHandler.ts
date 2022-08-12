import { OAS3Options, Paths, PathItem } from "swagger-jsdoc";

const swaggerOpenApiVersion = "3.0.0";

const swaggerInfo = {
  title: "ALL-LOGIN-API",
  version: "0.0.1",
  description:
    "<h2>All Login API</h2> \n" +
    "<h3>Repository</h3>" +
    'all-login: <a href="https://github.com/JuTiger-Lee/All-Login">https://github.com/JuTiger-Lee/All-Login</a> <br/>',
};

const swaggerTags = [
  {
    name: "User",
    description: "사용자 관련 API",
  },
];

const swaggerSchemes = ["http", "https"];

const swaggerSecurityDefinitions = {
  ApiKeyAuth: {
    type: "apiKey",
    name: "Authorization",
    in: "header",
  },
};

const swaggerProduces = ["application/json"];

const swaggerServers = [
  {
    url: "http://localhost:8080",
    description: "로컬 서버",
  },
];

const swaggerSecurityScheme = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "Token",
    name: "Authorization",
    description: "인증 토큰 값을 넣어주세요.",
    in: "header",
  },
};

const swaggerComponents = {
  // JWT_ERROR: {
  //   description: 'jwt token Error',
  //   type: 'object',
  //   properties: {
  //     401: {
  //       type: 'Error token 변조 에러',
  //     },
  //   },
  // },
  SERVER_ERROR: {
    description: "SERVER ERROR",
    type: "object",
    properties: {
      500: {
        type: "Internal Error",
        code: 800,
      },
    },
  },
};

/**
 * The Swagger Hanlder is having issues with concurrency
 * This is a problem with a Singleton Pattern
 */
export default class SwaggerHandler {
  private static swaggerInstance: SwaggerHandler;
  private option: OAS3Options = {
    definition: {
      openapi: swaggerOpenApiVersion,
      info: swaggerInfo,
      servers: swaggerServers,
      schemes: swaggerSchemes,
      securityDefinitions: swaggerSecurityDefinitions,

      /* open api 3.0.0 version option */
      produces: swaggerProduces,
      components: {
        securitySchemes: swaggerSecurityScheme,
        schemas: swaggerComponents,
      },
      tags: swaggerTags,
    },
    apis: [],
  };

  private setUpOption: {
    // search
    explorer: true;
  };

  private apiPaths = [];

  private constructor() {}

  static getSwaggerInstance() {
    if (!SwaggerHandler.swaggerInstance)
      SwaggerHandler.swaggerInstance = new SwaggerHandler();

    return SwaggerHandler.swaggerInstance;
  }

  private processAPI() {
    const path: Paths = {};

    for (let i = 0; i < this.apiPaths.length; i += 1) {
      for (const [key, value] of Object.entries(this.apiPaths[i])) {
        path[key] = value;
      }
    }

    return path;
  }

  addAPI(api: PathItem) {
    this.apiPaths.push(api);
  }

  /** TODO: add compoentns method  */
  addCompoents() {}

  getOption() {
    const path = this.processAPI();
    this.option.definition.paths = path;

    return {
      apiOption: this.option,
      setUpOption: this.setUpOption,
    };
  }
}
