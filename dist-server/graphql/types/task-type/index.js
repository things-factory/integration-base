"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_type_1 = require("./task-type");
const task_type_list_1 = require("./task-type-list");
exports.Query = `
  taskTypes: TaskTypeList
  taskType(name: String!): TaskType
`;
exports.Types = [task_type_1.TaskType, task_type_list_1.TaskTypeList];
//# sourceMappingURL=index.js.map