"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
async function Publish(step, { logger, publish, data }) {
    var { params: { tag, accessor } } = step;
    publish(tag, data[accessor]);
    return { data };
}
Publish.parameterSpec = [
    {
        type: 'string',
        name: 'tag',
        label: 'tag'
    },
    {
        type: 'string',
        name: 'accessor',
        label: 'accessor'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('publish', Publish);
//# sourceMappingURL=publish.js.map