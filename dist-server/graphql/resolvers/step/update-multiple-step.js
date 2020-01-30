"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.updateMultipleStep = {
    async updateMultipleStep(_, { scenarioId, patches }, context) {
        let results = [];
        const stepRepo = typeorm_1.getRepository(entities_1.Step);
        const scenario = await typeorm_1.getRepository(entities_1.Scenario).findOne(scenarioId);
        await stepRepo.delete({ domain: context.state.domain, scenario: scenarioId });
        for (let i = 0; i < patches.length; i++) {
            const result = await stepRepo.save(Object.assign(Object.assign({}, patches[i]), { sequence: i, scenario, domain: context.state.domain, creator: context.state.user, updater: context.state.user }));
            results.push(Object.assign(Object.assign({}, result), { cuFlag: '+' }));
        }
        return results;
    }
};
//# sourceMappingURL=update-multiple-step.js.map