"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.createScenario = {
    async createScenario(_, { scenario }, context) {
        return await typeorm_1.getRepository(entities_1.Scenario).save(Object.assign(Object.assign({}, scenario), { domain: context.state.domain, creator: context.state.user, updater: context.state.user }));
    }
};
//# sourceMappingURL=create-scenario.js.map