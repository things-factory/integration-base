"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const connections_1 = require("../connections");
async function EchoSend(step, { logger }) {
    var { connection: connectionName, params: { message } } = step;
    var connection = connections_1.Connections.getConnection(connectionName);
    if (!connection) {
        throw Error(`connection is not found : ${connectionName}`);
    }
    var retval = await connection.write(message);
    logger.info(`echo-send : '${message}'`);
    return {
        data: retval
    };
}
EchoSend.parameterSpec = [
    {
        type: 'string',
        name: 'message',
        label: 'message'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('echo-send', EchoSend);
//# sourceMappingURL=echo-send.js.map