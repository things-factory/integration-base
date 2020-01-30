"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.stopScenario = {
    async stopScenario(_, { name }, context) {
        var repository = typeorm_1.getRepository(entities_1.Scenario);
        var scenario = await repository.findOne({
            where: { domain: context.state.domain, name },
            relations: ['domain', 'steps', 'creator', 'updater']
        });
        await scenario.stop();
        await repository.save(scenario);
        return scenario;
    }
};
//# sourceMappingURL=stop-scenario.js.map