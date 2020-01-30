"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.deleteScenarios = {
    async deleteScenarios(_, { ids }, context) {
        await typeorm_1.getRepository(entities_1.Scenario).delete({
            domain: context.state.domain,
            id: typeorm_1.In(ids)
        });
        return true;
    }
};
//# sourceMappingURL=delete-scenarios.js.map