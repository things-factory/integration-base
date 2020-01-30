"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.Scenario = graphql_tag_1.default `
  type Scenario {
    id: String
    name: String
    domain: Domain
    description: String
    active: Boolean
    status: Int
    schedule: String
    timezone: String
    steps: [Step]
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`;
//# sourceMappingURL=scenario.js.map