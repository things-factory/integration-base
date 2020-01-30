"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.ConnectorList = graphql_tag_1.default `
  type ConnectorList {
    items: [Connector]
    total: Int
  }
`;
//# sourceMappingURL=connector-list.js.map