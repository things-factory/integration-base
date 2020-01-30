"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../../../engine/task-registry");
exports.taskTypesResolver = {
    taskTypes(_, {}, context) {
        var taskTypes = task_registry_1.TaskRegistry.getTaskHandlers();
        var items = Object.keys(taskTypes).map(name => {
            return {
                name,
                description: '',
                parameterSpec: taskTypes[name].parameterSpec
            };
        });
        return {
            items,
            total: items.length
        };
    }
};
//# sourceMappingURL=task-types.js.map