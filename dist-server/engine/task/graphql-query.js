"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const connections_1 = require("../connections");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
async function GraphqlQuery(step, { logger }) {
    var { connection: connectionName, params: stepOptions } = step;
    var { query } = stepOptions || {};
    var client = connections_1.Connections.getConnection(connectionName);
    var response = await client.query({
        query: graphql_tag_1.default `
      ${query}
    `
    });
    var data = response.data;
    logger.info(`graphql-query : \n${JSON.stringify(data, null, 2)}`);
    return {
        data
    };
}
GraphqlQuery.parameterSpec = [
    {
        type: 'graphql',
        name: 'query',
        label: 'query'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('graphql-query', GraphqlQuery);
//# sourceMappingURL=graphql-query.js.map