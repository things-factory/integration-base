"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const connections_1 = require("../connections");
async function EchoReceive(step, { logger }) {
    var { connection: connectionName } = step;
    var connection = connections_1.Connections.getConnection(connectionName);
    var message = await connection.read();
    logger.info(`echo-receive : '${message.toString()}'`);
    return {
        data: message
    };
}
EchoReceive.parameterSpec = [];
task_registry_1.TaskRegistry.registerTaskHandler('echo-receive', EchoReceive);
//# sourceMappingURL=echo-receive.js.map