"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const connections_1 = require("../connections");
// import { schema } from '@things-factory/shell/dist-server/schema'
const graphql_tag_1 = __importDefault(require("graphql-tag"));
async function LocalGraphqlMutate(step, { logger }) {
    var { connection: connectionName, params: stepOptions } = step;
    var { mutation } = stepOptions || {};
    var client = connections_1.Connections.getConnection(connectionName);
    var response = await client.mutate({
        mutation: graphql_tag_1.default `
      ${mutation}
    `
    });
    var data = response.data;
    logger.info(`local-graphql-mutate : \n${JSON.stringify(data, null, 2)}`);
    return {
        data
    };
}
LocalGraphqlMutate.parameterSpec = [
    {
        type: 'graphql',
        name: 'mutation',
        label: 'mutation'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('local-graphql-mutate', LocalGraphqlMutate);
//# sourceMappingURL=local-graphql-mutate.js.map