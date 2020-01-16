"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const step_1 = require("./step");
const steps_1 = require("./steps");
const update_step_1 = require("./update-step");
const update_multiple_step_1 = require("./update-multiple-step");
const create_step_1 = require("./create-step");
const delete_step_1 = require("./delete-step");
const delete_steps_1 = require("./delete-steps");
exports.Query = Object.assign(Object.assign({}, steps_1.stepsResolver), step_1.stepResolver);
exports.Mutation = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, update_step_1.updateStep), update_multiple_step_1.updateMultipleStep), create_step_1.createStep), delete_step_1.deleteStep), delete_steps_1.deleteSteps);
//# sourceMappingURL=index.js.map