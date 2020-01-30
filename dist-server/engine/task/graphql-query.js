"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const connections_1 = require("../connections");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
async function GraphqlQuery(step, { logger, data }) {
    var { connection: connectionName, params: stepOptions } = step;
    var { query } = stepOptions || {};
    var vos = (query.match(/\${[^}]*}/gi) || []).map((key) => {
        if (data) {
            key = key.replace('$', '').replace('{', '').replace('}', '');
            let value = eval(`data.${key}`); // ex: ${stepName.object.key}
            let vo = { key, value };
            return vo;
        }
    });
    vos.forEach((vo) => {
        let keyname = vo['key'];
        query = query.replace(new RegExp(`\\$\{${keyname}\}`, 'gi'), vo['value']);
    });
    var client = connections_1.Connections.getConnection(connectionName);
    var response = await client.query({
        query: graphql_tag_1.default `
      ${query}
    `
    });
    var newData = response.data;
    logger.info(`graphql-query : \n${JSON.stringify(newData, null, 2)}`);
    return {
        data: newData
    };
}
GraphqlQuery.parameterSpec = [
    {
        type: 'textarea',
        name: 'query',
        label: 'query'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('graphql-query', GraphqlQuery);
//# sourceMappingURL=graphql-query.js.map