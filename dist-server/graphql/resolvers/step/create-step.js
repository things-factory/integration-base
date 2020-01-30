"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.createStep = {
    async createStep(_, { step }, context) {
        return await typeorm_1.getRepository(entities_1.Step).save(Object.assign(Object.assign({}, step), { domain: context.state.domain, creator: context.state.user, updater: context.state.user }));
    }
};
//# sourceMappingURL=create-step.js.map