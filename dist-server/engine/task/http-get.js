"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const connections_1 = require("../connections");
const http_auth_1 = require("./http-auth");
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("url");
async function HttpGet(step, { logger }) {
    var { connection: connectionName, params: stepOptions } = step;
    var { headers, params = {}, path } = stepOptions || {};
    var connection = connections_1.Connections.getConnection(connectionName);
    if (!connection) {
        throw new Error(`connection '${connectionName}' is not established.`);
    }
    var { endpoint, params: connectionParams } = connection;
    var url = new url_1.URL(path, endpoint);
    // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    var response = await node_fetch_1.default(url, {
        method: 'GET',
        headers: Object.assign({}, (http_auth_1.GET_AUTH_HEADERS(connectionParams) || {})
        // ...headers
        )
    });
    // TODO follow the format
    // plain-text
    var data = await response.json();
    // var data = await response.text()
    logger.info(`http-get : \n${JSON.stringify(data, null, 2)}`);
    return {
        data
    };
}
HttpGet.parameterSpec = [
    {
        type: 'string',
        name: 'path',
        label: 'path'
    },
    {
        type: 'string',
        name: 'headers',
        label: 'headers'
    },
    {
        type: 'string',
        name: 'params',
        label: 'params'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('http-get', HttpGet);
//# sourceMappingURL=http-get.js.map