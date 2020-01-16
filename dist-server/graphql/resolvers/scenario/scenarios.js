"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell_1 = require("@things-factory/shell");
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
const engine_1 = require("../../../engine");
exports.scenariosResolver = {
    async scenarios(_, params, context) {
        const convertedParams = shell_1.convertListParams(params, context.state.domain.id);
        const [items, total] = await typeorm_1.getRepository(entities_1.Scenario).findAndCount(Object.assign(Object.assign({}, convertedParams), { relations: ['domain', 'steps', 'creator', 'updater'] }));
        items.forEach(scenario => {
            scenario.status = engine_1.ScenarioEngine.getScenario(scenario.name) ? 1 : 0;
        });
        return { items, total };
    }
};
//# sourceMappingURL=scenarios.js.map