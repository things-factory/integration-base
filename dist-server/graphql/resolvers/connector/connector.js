"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connections_1 = require("../../../engine/connections");
exports.connectorResolver = {
    connector(_, { name }, context) {
        var connector = connections_1.Connections.getConnector(name);
        return {
            name,
            description: '',
            parameterSpec: connector.parameterSpec
        };
    }
};
//# sourceMappingURL=connector.js.map