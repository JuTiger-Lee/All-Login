import { PathItem } from "swagger-jsdoc";

export default {
  "/api/user/naver/sign-out": {
    get: {
      tags: ["User"],
      summary: "네이버 사용자 로그아웃 (개발 중)",
      // 인증
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "네이버 로그아웃 성공",
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
                    example: "Naver Sign Out Success",
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
