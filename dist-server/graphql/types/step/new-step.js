"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.NewStep = graphql_tag_1.default `
  input NewStep {
    name: String!
    description: String
    sequence: Int
    task: String
    connection: String
    params: String
  }
`;
//# sourceMappingURL=new-step.js.map