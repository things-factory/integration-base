"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const new_connection_1 = require("./new-connection");
const connection_patch_1 = require("./connection-patch");
const connection_list_1 = require("./connection-list");
exports.Mutation = `
  createConnection (
    connection: NewConnection!
  ): Connection

  updateConnection (
    name: String!
    patch: ConnectionPatch!
  ): Connection

  updateMultipleConnection (
    patches: [ConnectionPatch]!
  ): [Connection]

  deleteConnection (
    name: String!
  ): Boolean

  deleteConnections (
    names: [String]!
  ): Boolean

  connectConnection (
    name: String!
  ): Connection

  disconnectConnection (
    name: String!
  ): Connection
`;
exports.Query = `
  connections(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ConnectionList
  connection(name: String!): Connection
`;
exports.Types = [connection_1.Connection, new_connection_1.NewConnection, connection_patch_1.ConnectionPatch, connection_list_1.ConnectionList];
//# sourceMappingURL=index.js.map