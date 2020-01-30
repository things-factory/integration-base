"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
const entities_1 = require("../../entities");
const typeorm_1 = require("typeorm");
async function SubScenario(step, { logger, load, data }) {
    var { name, params: { scenario } } = step;
    var subscenario = await typeorm_1.getRepository(entities_1.Scenario).findOne({
        where: {
            id: scenario
        },
        relations: ['steps']
    });
    logger.info(`Sub Scenario '${subscenario.name}' Started.`);
    await load(name, subscenario);
    logger.info(`Sub Scenario '${subscenario.name}' done.`);
    return scenario;
}
SubScenario.parameterSpec = [
    {
        type: 'entity-selector',
        name: 'scenario',
        label: 'scenario',
        property: {
            queryName: 'scenarios'
        }
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('scenario', SubScenario);
//# sourceMappingURL=sub-scenario.js.map