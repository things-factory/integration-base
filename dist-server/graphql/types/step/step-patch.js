"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.StepPatch = graphql_tag_1.default `
  input StepPatch {
    id: String
    name: String
    description: String
    sequence: Int
    task: String
    connection: String
    params: String
    cuFlag: String
  }
`;
//# sourceMappingURL=step-patch.js.map