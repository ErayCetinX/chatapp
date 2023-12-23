"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../../constant");
const token = {
    generate: ({ uuid, username, email, isOnline }, expiresIn) => jsonwebtoken_1.default.sign({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        uuid, username, email,
    }, constant_1.SECRET_KEY, {
        expiresIn,
    }),
};
exports.default = token;
//# sourceMappingURL=token.js.map