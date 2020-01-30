"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.TaskType = graphql_tag_1.default `
  type TaskType {
    name: String
    description: String
    parameterSpec: [PropertySpec]
  }
`;
//# sourceMappingURL=task-type.js.map