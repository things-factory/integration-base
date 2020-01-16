"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connections_1 = require("../../../engine/connections");
exports.connectorsResolver = {
    connectors(_, {}, context) {
        var connectors = connections_1.Connections.getConnectors();
        var items = Object.keys(connectors).map(name => {
            return {
                name,
                description: '',
                parameterSpec: connectors[name].parameterSpec
            };
        });
        return {
            items,
            total: items.length
        };
    }
};
//# sourceMappingURL=connectors.js.map