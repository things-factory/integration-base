"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell_1 = require("@things-factory/shell");
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
const engine_1 = require("../../../engine");
exports.connectionsResolver = {
    async connections(_, params, context) {
        const convertedParams = shell_1.convertListParams(params, context.state.domain.id);
        const [items, total] = await typeorm_1.getRepository(entities_1.Connection).findAndCount(Object.assign(Object.assign({}, convertedParams), { relations: ['domain', 'creator', 'updater'] }));
        items.forEach(conn => {
            conn.status = engine_1.Connections.getConnection(conn.name) ? 1 : 0;
        });
        return { items, total };
    }
};
//# sourceMappingURL=connections.js.map