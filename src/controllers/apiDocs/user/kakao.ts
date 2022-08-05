import { PathItem } from "swagger-jsdoc";

export default {
  "/api/user/kakao/sign-out": {
    get: {
      tags: ["User"],
      summary: "카카오 사용자 로그아웃 (개발 중)",
      parameters: [
        {
          in: "query",
          name: "accessToken",
          required: true,
          description: "kakao access Token",
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "카카오 로그아웃 성공",
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
                    example: "kakao Sign Out Success",
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
