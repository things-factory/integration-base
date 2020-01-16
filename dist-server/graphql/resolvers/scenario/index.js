"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scenario_1 = require("./scenario");
const scenarios_1 = require("./scenarios");
const update_scenario_1 = require("./update-scenario");
const update_multiple_scenario_1 = require("./update-multiple-scenario");
const create_scenario_1 = require("./create-scenario");
const delete_scenario_1 = require("./delete-scenario");
const delete_scenarios_1 = require("./delete-scenarios");
const start_scenario_1 = require("./start-scenario");
const stop_scenario_1 = require("./stop-scenario");
const scenario_state_1 = require("./scenario-state");
exports.Query = Object.assign(Object.assign({}, scenarios_1.scenariosResolver), scenario_1.scenarioResolver);
exports.Mutation = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, update_scenario_1.updateScenario), update_multiple_scenario_1.updateMultipleScenario), create_scenario_1.createScenario), delete_scenario_1.deleteScenario), delete_scenarios_1.deleteScenarios), start_scenario_1.startScenario), stop_scenario_1.stopScenario);
exports.Subscription = Object.assign({}, scenario_state_1.scenarioState);
//# sourceMappingURL=index.js.map