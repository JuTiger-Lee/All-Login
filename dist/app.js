"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("@/routers/index"));
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.port = Number(process.env.PORT) || 8080;
    }
    bootstrap() {
        (0, index_1.default)(this.server);
    }
}
const app = new App();
app.bootstrap();
exports.default = app;
//# sourceMappingURL=app.js.map