"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
const engine_1 = require("../../../engine");
exports.connectionResolver = {
    async connection(_, { name }, context) {
        var conn = await typeorm_1.getRepository(entities_1.Connection).findOne({
            where: { domain: context.state.domain, name },
            relations: ['domain', 'creator', 'updater']
        });
        if (conn) {
            conn.status = engine_1.Connections.getConnection(name) ? 1 : 0;
        }
        return conn;
    }
};
//# sourceMappingURL=connection.js.map