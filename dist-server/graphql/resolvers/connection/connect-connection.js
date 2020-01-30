"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.connectConnection = {
    async connectConnection(_, { name }, context) {
        var repository = typeorm_1.getRepository(entities_1.Connection);
        var connection = await repository.findOne({
            where: { domain: context.state.domain, name },
            relations: ['domain', 'creator', 'updater']
        });
        await connection.connect();
        await repository.save(connection);
        return connection;
    }
};
//# sourceMappingURL=connect-connection.js.map