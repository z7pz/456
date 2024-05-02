"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const database_1 = require("../database");
async function getUser(id) {
    let user = await database_1.prisma.user.findFirst({
        where: {
            id,
        },
        include: {
            bots: true,
        },
    });
    if (!user) {
        user = await database_1.prisma.user.create({
            data: {
                id,
            },
            include: {
                bots: true
            }
        });
    }
    return user;
}
exports.getUser = getUser;
