"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
async function Log(step, { logger }) {
    var { params: { message, level = 'info' } } = step;
    switch (level) {
        case 'error':
            logger.error(message);
            return;
        case 'warn':
            logger.warn(message);
            return;
        default:
            logger.info(message);
    }
    return {
        data: message
    };
}
Log.parameterSpec = [
    {
        type: 'string',
        name: 'message',
        label: 'message'
    },
    {
        type: 'select',
        name: 'level',
        label: 'level',
        property: {
            options: ['info', 'warn', 'error']
        }
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('log', Log);
//# sourceMappingURL=log.js.map