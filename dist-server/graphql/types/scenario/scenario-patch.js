"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.ScenarioPatch = graphql_tag_1.default `
  input ScenarioPatch {
    id: String
    name: String
    description: String
    schedule: String
    timezone: String
    active: Boolean
    cuFlag: String
  }
`;
//# sourceMappingURL=scenario-patch.js.map