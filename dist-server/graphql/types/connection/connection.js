"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.Connection = graphql_tag_1.default `
  type Connection {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    status: Int
    active: Boolean
    params: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`;
//# sourceMappingURL=connection.js.map