"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connector_1 = require("./connector");
const connector_list_1 = require("./connector-list");
exports.Query = `
  connectors: ConnectorList
  connector(name: String!): Connector
`;
exports.Types = [connector_1.Connector, connector_list_1.ConnectorList];
//# sourceMappingURL=index.js.map