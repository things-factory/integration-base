"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.ConnectionPatch = graphql_tag_1.default `
  input ConnectionPatch {
    id: String
    name: String
    description: String
    type: String
    endpoint: String
    active: Boolean
    params: String
    cuFlag: String
  }
`;
//# sourceMappingURL=connection-patch.js.map