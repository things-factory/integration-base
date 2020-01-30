"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.ScenarioState = graphql_tag_1.default `
  type Progress {
    rounds: Int!
    rate: Int!
    steps: Int!
    step: Int!
  }

  enum ScenarioStatus {
    READY
    STARTED
    PAUSED
    STOPPED
    HALTED
  }

  type ScenarioState {
    name: String!
    state: ScenarioStatus!
    progress: Progress!
    message: String
  }
`;
//# sourceMappingURL=scenario-state.js.map