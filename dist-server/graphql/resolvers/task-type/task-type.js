"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../../../engine/task-registry");
exports.taskTypeResolver = {
    taskType(_, { name }, context) {
        var taskType = task_registry_1.TaskRegistry.getTaskHandler(name);
        return {
            name,
            description: '',
            parameterSpec: taskType.parameterSpec
        };
    }
};
//# sourceMappingURL=task-type.js.map