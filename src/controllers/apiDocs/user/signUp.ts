import { PathItem } from "swagger-jsdoc";

export default {
  "/api/user/sign-up": {
    post: {
      tags: ["User"],
      summary: "사용자 회원가입 (완료)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                email: {
                  type: "string",
                  description: "사용자 이메일",
                  example: "hello@example.com",
                },
                password: {
                  type: "string",
                  description: "사용자 패스워드",
                  example: "examplePassword",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "회원가입 성공",
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
                    example: "Sign Up Success",
                  },
                  data: {
                    type: "array",
                    description: "data",
                    example: [{ token: "abcd" }],
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
