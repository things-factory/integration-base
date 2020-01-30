"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("@things-factory/env");
const connections_1 = require("../connections");
const apollo_client_1 = require("apollo-client");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_link_1 = require("apollo-link");
const apollo_link_error_1 = require("apollo-link-error");
const apollo_upload_client_1 = require("apollo-upload-client");
const apollo_link_batch_http_1 = require("apollo-link-batch-http");
require("cross-fetch/polyfill");
const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
    },
    mutate: {
        errorPolicy: 'all'
    }
};
const cache = new apollo_cache_inmemory_1.InMemoryCache({
    addTypename: false
});
class GraphqlConnector {
    async ready(connectionConfigs) {
        await Promise.all(connectionConfigs.map(this.connect));
        env_1.logger.info('graphql-connector connections are ready');
    }
    async connect(connection) {
        var { endpoint: uri } = connection;
        var httpOptions = {
            uri,
            credentials: 'include'
        };
        var httpLink = apollo_link_1.ApolloLink.split(operation => operation.getContext().hasUpload, apollo_upload_client_1.createUploadLink(httpOptions), new apollo_link_batch_http_1.BatchHttpLink(httpOptions));
        var ERROR_HANDLER = ({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.map(({ message, locations, path }) => {
                    env_1.logger.error(`[GraphQL error] Message: ${message}, Location: ${locations}, Path: ${path}`);
                });
            if (networkError) {
                env_1.logger.error(`[Network error - ${networkError.statusCode}] ${networkError}`);
            }
        };
        connections_1.Connections.addConnection(connection.name, new apollo_client_1.ApolloClient({
            defaultOptions,
            cache,
            link: apollo_link_1.ApolloLink.from([apollo_link_error_1.onError(ERROR_HANDLER), httpLink])
        }));
    }
    async disconnect(name) {
        var client = connections_1.Connections.getConnection(name);
        client.stop();
        connections_1.Connections.removeConnection(name);
    }
    get parameterSpec() {
        return [];
    }
}
exports.GraphqlConnector = GraphqlConnector;
connections_1.Connections.registerConnector('graphql-connector', new GraphqlConnector());
//# sourceMappingURL=graphql-connector.js.map