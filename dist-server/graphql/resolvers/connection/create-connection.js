"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.createConnection = {
    async createConnection(_, { connection }, context) {
        return await typeorm_1.getRepository(entities_1.Connection).save(Object.assign(Object.assign({}, connection), { domain: context.state.domain, creator: context.state.user, updater: context.state.user }));
    }
};
//# sourceMappingURL=create-connection.js.map