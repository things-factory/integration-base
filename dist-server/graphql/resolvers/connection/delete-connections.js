"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.deleteConnections = {
    async deleteConnections(_, { names }, context) {
        await typeorm_1.getRepository(entities_1.Connection).delete({
            domain: context.state.domain,
            name: typeorm_1.In(names)
        });
        return true;
    }
};
//# sourceMappingURL=delete-connections.js.map