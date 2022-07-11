"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("@/controllers/user"));
const router = express_1.default.Router();
const userController = new user_1.default();
router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.SignIn);
exports.default = router;
//# sourceMappingURL=user.js.map