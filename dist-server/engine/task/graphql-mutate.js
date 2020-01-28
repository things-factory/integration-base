"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const connections_1 = require("../connections");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
async function GraphqlMutate(step, { logger, data }) {
    var { connection: connectionName, params: stepOptions } = step;
    var { mutation } = stepOptions || {};
    var vos = (mutation.match(/\${[^}]*}/gi) || []).map((key) => {
        let value = eval(`data.${key.replace('$', '').replace('{', '').replace('}', '')}`); // ex: ${stepName.object.value}
        let vo = { key, value };
        return vo;
    });
    vos.forEach((vo) => {
        mutation = mutation.replace(/${vo['key']}/g, vo['value']);
    });
    var client = connections_1.Connections.getConnection(connectionName);
    var response = await client.mutate({
        mutation: graphql_tag_1.default `
      ${mutation}
    `
    });
    var newData = response.data;
    logger.info(`graphql-mutate : \n${JSON.stringify(newData, null, 2)}`);
    return {
        data: newData
    };
}
GraphqlMutate.parameterSpec = [
    {
        type: 'textarea',
        name: 'mutation',
        label: 'mutation'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('graphql-mutate', GraphqlMutate);
//# sourceMappingURL=graphql-mutate.js.map