"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell_1 = require("@things-factory/shell");
const apollo_server_koa_1 = require("apollo-server-koa");
exports.publishData = {
    publishData: {
        /* subscription payload can be filtered here */
        // resolve(payload, args) {
        //   return payload.systemRebooted
        // },
        // subscribe(_, args, { ctx }) {
        /* it is possible to check authentication here */
        // if (!ctx.user) {
        //   return null
        // }
        // return pubsub.asyncIterator('publish-data')
        // }
        subscribe: apollo_server_koa_1.withFilter(() => shell_1.pubsub.asyncIterator('publish-data'), (payload, variables) => {
            return !variables.tag || payload.publishData.tag === variables.tag;
        })
    }
};
//# sourceMappingURL=publish-data.js.map