"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const task_registry_1 = require("../task-registry");
async function Sleep(step, { logger }) {
    var { params: { duration } } = step;
    logger.info(`sleep ${duration}ms`);
    if (duration) {
        await utils_1.sleep(duration);
    }
    return {
        data: duration
    };
}
Sleep.parameterSpec = [
    {
        type: 'number',
        name: 'duration',
        placeholder: 'milli-seconds',
        label: 'duration'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('sleep', Sleep);
//# sourceMappingURL=sleep.js.map