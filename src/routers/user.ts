import express from "express";
import UserController from "@/controllers/UserController";

const router = express.Router();
const userController = new UserController();

// ::TODO FIX: TypeDI에 내부의 문제 때문에 req, res, next 파라미터를 controller에 직접 보내야하는 문제가 있음
router.post("/sign-up", (req, res, next) =>
  userController.userLocal.signUp(req, res, next)
);
router.post("/sign-in", (req, res, next) =>
  userController.userLocal.signIn(req, res, next)
);
router.post("/auth/test", (req, res, next) =>
  userController.testAuth(req, res, next)
);

router.get("/kakao", (req, res, next) => {
  userController.userKakao.signIn(req, res, next);
});
router.get("/kakao/callback", (req, res, next) => {
  userController.userKakao.signInCallback(req, res, next);
});
router.get("/kakao/sign-out", async (req, res, next) =>
  userController.userKakao.signOut(req, res, next)
);

export default router;
