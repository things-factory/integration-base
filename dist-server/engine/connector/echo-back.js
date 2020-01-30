"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const promise_socket_1 = __importDefault(require("promise-socket"));
const env_1 = require("@things-factory/env");
const connections_1 = require("../connections");
class EchoBack {
    ready(connectionConfigs) {
        const ECHO_SERVER = env_1.config.get('echoServer');
        return new Promise((resolve, reject) => {
            var server = net_1.default.createServer(socket => {
                socket.on('data', function (data) {
                    socket.write(data.toString());
                });
            });
            server.listen(ECHO_SERVER.port, async () => {
                env_1.logger.info('Echo-back server listening on %j', server.address());
                await Promise.all(connectionConfigs.map(this.connect));
                resolve();
            });
        });
    }
    async connect(connection) {
        let socket = new promise_socket_1.default(new net_1.default.Socket());
        let [host, port = 8124] = connection.endpoint.split(':');
        let { timeout = 30000 } = connection.params || {};
        socket.setTimeout(timeout);
        await socket.connect(port, host);
        connections_1.Connections.addConnection(connection.name, socket);
    }
    async disconnect(name) {
        let socket = connections_1.Connections.removeConnection(name);
        await socket.destroy();
    }
    get parameterSpec() {
        return [
            {
                type: 'number',
                label: 'timeout',
                placeholder: 'milli-seconds',
                name: 'timeout'
            }
        ];
    }
}
exports.EchoBack = EchoBack;
connections_1.Connections.registerConnector('echo-back', new EchoBack());
//# sourceMappingURL=echo-back.js.map