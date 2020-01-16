"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const step_1 = require("./step");
const new_step_1 = require("./new-step");
const step_patch_1 = require("./step-patch");
const step_list_1 = require("./step-list");
exports.Mutation = `
  createStep (
    step: NewStep!
  ): Step

  updateStep (
    name: String!
    patch: StepPatch!
  ): Step

  updateMultipleStep (
    scenarioId: String
    patches: [StepPatch]!
  ): [Step]

  deleteStep (
    id: String!
  ): Boolean

  deleteSteps (
    ids: [String]!
  ): Boolean
`;
exports.Query = `
  steps(filters: [Filter], pagination: Pagination, sortings: [Sorting]): StepList
  step(name: String!): Step
`;
exports.Types = [step_1.Step, new_step_1.NewStep, step_patch_1.StepPatch, step_list_1.StepList];
//# sourceMappingURL=index.js.map