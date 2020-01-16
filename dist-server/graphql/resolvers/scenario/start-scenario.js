"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.startScenario = {
    async startScenario(_, { name }, context, data) {
        var repository = typeorm_1.getRepository(entities_1.Scenario);
        var scenario = await repository.findOne({
            where: { domain: context.state.domain, name },
            relations: ['domain', 'steps', 'creator', 'updater']
        });
        await scenario.start(data);
        await repository.save(scenario);
        return scenario;
    }
};
//# sourceMappingURL=start-scenario.js.map