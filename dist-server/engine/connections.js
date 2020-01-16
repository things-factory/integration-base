"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("@things-factory/env");
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
class Connections {
    static async ready() {
        const CONNECTIONS = await typeorm_1.getRepository(entities_1.Connection).find({
            where: { active: true },
            relations: ['domain', 'creator', 'updater']
        });
        return Promise.all(Object.keys(Connections.connectors).map(type => {
            var connector = Connections.connectors[type];
            return connector.ready(CONNECTIONS.filter(connection => connection.type == type)).catch(error => {
                env_1.logger.error(error.message);
            });
        }));
    }
    static registerConnector(type, connector) {
        Connections.connectors[type] = connector;
    }
    static getConnector(type) {
        return Connections.connectors[type];
    }
    static getConnectors() {
        return Object.assign({}, Connections.connectors);
    }
    static unregisterConnector(type) {
        delete Connections.connectors[type];
    }
    static getConnection(name) {
        return Connections.connections[name];
    }
    static getConnections() {
        return Object.assign({}, Connections.connections);
    }
    static addConnection(name, connection) {
        Connections.connections[name] = connection;
    }
    static removeConnection(name) {
        var connection = Connections.connections[name];
        delete Connections.connections[name];
        return connection;
    }
}
exports.Connections = Connections;
Connections.connectors = {};
Connections.connections = {};
//# sourceMappingURL=connections.js.map