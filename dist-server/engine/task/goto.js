"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
async function Goto(step, { logger }) {
    var { params: { goto } } = step;
    return {
        next: goto
    };
}
Goto.parameterSpec = [
    {
        type: 'string',
        name: 'goto',
        label: 'goto'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('goto', Goto);
//# sourceMappingURL=goto.js.map