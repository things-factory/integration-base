"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.PropertySpec = graphql_tag_1.default `
  type PropertySpec {
    type: String!
    label: String!
    name: String!
    placeholder: String
    property: Object
  }
`;
//# sourceMappingURL=property-spec.js.map