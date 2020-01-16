"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.updateConnection = {
    async updateConnection(_, { name, patch }, context) {
        const repository = typeorm_1.getRepository(entities_1.Connection);
        const connection = await repository.findOne({
            where: { domain: context.state.domain, name }
        });
        return await repository.save(Object.assign(Object.assign(Object.assign({}, connection), patch), { updater: context.state.user }));
    }
};
//# sourceMappingURL=update-connection.js.map