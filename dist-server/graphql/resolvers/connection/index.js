"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const connections_1 = require("./connections");
const update_connection_1 = require("./update-connection");
const update_multiple_connection_1 = require("./update-multiple-connection");
const create_connection_1 = require("./create-connection");
const delete_connection_1 = require("./delete-connection");
const delete_connections_1 = require("./delete-connections");
const connect_connection_1 = require("./connect-connection");
const disconnect_connection_1 = require("./disconnect-connection");
exports.Query = Object.assign(Object.assign({}, connections_1.connectionsResolver), connection_1.connectionResolver);
exports.Mutation = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, update_connection_1.updateConnection), update_multiple_connection_1.updateMultipleConnection), create_connection_1.createConnection), delete_connection_1.deleteConnection), delete_connections_1.deleteConnections), connect_connection_1.connectConnection), disconnect_connection_1.disconnectConnection);
//# sourceMappingURL=index.js.map