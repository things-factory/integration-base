"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
const engine_1 = require("../../../engine");
exports.scenarioResolver = {
    async scenario(_, { id }, context) {
        var sc = await typeorm_1.getRepository(entities_1.Scenario).findOne({
            where: { domain: context.state.domain, id },
            relations: ['domain', 'steps', 'creator', 'updater']
        });
        if (sc) {
            sc.status = engine_1.ScenarioEngine.getScenario(sc.name) ? 1 : 0;
        }
        return sc;
    }
};
//# sourceMappingURL=scenario.js.map