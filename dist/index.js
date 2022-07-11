"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tsconfig.json paths를 사용하기 위함
require("module-alias/register");
const app_1 = __importDefault(require("@/app"));
const { server, port } = app_1.default;
const init = () => server.listen(port, () => console.log(`${port} Server Start!`));
init();
//# sourceMappingURL=index.js.map