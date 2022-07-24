import { PathItem } from "swagger-jsdoc";

export default {
  "/api/user/auth/test": {
    post: {
      tags: ["User"],
      summary: "인증 Token 테스트 (완료)",
      // security: [
      //   {
      //     bearerAuth: [],
      //   },
      // ],
      responses: {
        200: {
          description: "인증 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: {
                    type: "number",
                    description: "code",
                    example: 200,
                  },
                  message: {
                    type: "string",
                    description: "성공 메시지",
                    example: "Auth Test Success",
                  },
                  data: {
                    type: "array",
                    description: "data",
                    example: [],
                  },
                },
              },
            },
          },
        },
      },
    },
  } as PathItem,
};
