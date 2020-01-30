"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { GraphQLScalarType } = require('graphql');
exports.GraphQLObject = new GraphQLScalarType({
    name: 'Object',
    description: 'Can be anything',
    parseValue(value) {
        return value;
    },
    serialize(value) {
        return value;
    },
    parseLiteral(ast) {
        return ast;
    }
});
//# sourceMappingURL=object-type.js.map