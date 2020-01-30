"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.Step = graphql_tag_1.default `
  type Step {
    id: String
    name: String
    domain: Domain
    description: String
    scenario: Scenario
    sequence: Int
    task: String
    connection: String
    params: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`;
//# sourceMappingURL=step.js.map