"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("@/routers/user"));
exports.default = (app) => {
    app.get('/', (req, res) => res.send('Hello Login'));
    app.use('/api/user', user_1.default);
};
//# sourceMappingURL=index.js.map