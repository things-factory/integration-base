"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const types_1 = require("../types");
async function End(step, { logger }) {
    return {
        state: types_1.SCENARIO_STATE.STOPPED
    };
}
End.parameterSpec = [];
task_registry_1.TaskRegistry.registerTaskHandler('end', End);
//# sourceMappingURL=end.js.map