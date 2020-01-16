"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scenario_1 = require("./scenario");
const new_scenario_1 = require("./new-scenario");
const scenario_patch_1 = require("./scenario-patch");
const scenario_list_1 = require("./scenario-list");
const scenario_state_1 = require("./scenario-state");
exports.Mutation = `
  createScenario (
    scenario: NewScenario!
  ): Scenario

  updateScenario (
    name: String!
    patch: ScenarioPatch!
  ): Scenario

  updateMultipleScenario (
    patches: [ScenarioPatch]!
  ): [Scenario]

  deleteScenario (
    name: String!
  ): Boolean

  deleteScenarios (
    ids: [String]!
  ): Boolean

  startScenario (
    name: String!
  ): Scenario

  stopScenario (
    name: String!
  ): Scenario
`;
exports.Query = `
  scenarios(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ScenarioList
  scenario(id: String!): Scenario
`;
exports.Subscription = `
  scenarioState(name: String): ScenarioState
`;
exports.Types = [scenario_1.Scenario, new_scenario_1.NewScenario, scenario_patch_1.ScenarioPatch, scenario_list_1.ScenarioList, scenario_state_1.ScenarioState];
//# sourceMappingURL=index.js.map