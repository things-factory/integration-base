"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("@things-factory/env");
const connections_1 = require("../connections");
class HttpConnector {
    async ready(connectionConfigs) {
        await Promise.all(connectionConfigs.map(this.connect));
        env_1.logger.info('http-connector connections are ready');
    }
    async connect(connection) {
        try {
            var params = JSON.parse(connection.params);
        }
        catch (e) {
            env_1.logger.error(e);
        }
        connections_1.Connections.addConnection(connection.name, Object.assign(Object.assign({}, connection), { params }));
    }
    async disconnect(name) {
        connections_1.Connections.removeConnection(name);
    }
    get parameterSpec() {
        return [
            {
                type: 'select',
                label: 'authtype',
                name: 'authtype',
                property: {
                    options: ['', 'basic']
                }
            },
            {
                type: 'string',
                label: 'username',
                name: 'username'
            },
            {
                type: 'password',
                label: 'password',
                name: 'password'
            }
        ];
    }
}
exports.HttpConnector = HttpConnector;
connections_1.Connections.registerConnector('http-connector', new HttpConnector());
//# sourceMappingURL=http-connector.js.map