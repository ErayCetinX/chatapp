"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers = {
    Mutation: {
        registerUser: (_, { newUser: { username, password, email, confirmPassword, DeviceToken } }, { prisma }) => {
            console.log({ username, password, email, confirmPassword, DeviceToken });
        }
    }
};
exports.default = resolvers;
