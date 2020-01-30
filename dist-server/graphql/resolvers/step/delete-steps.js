"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.deleteSteps = {
    async deleteSteps(_, { ids }, context) {
        await typeorm_1.getRepository(entities_1.Step).delete({
            domain: context.state.domain,
            id: typeorm_1.In(ids)
        });
        return true;
    }
};
//# sourceMappingURL=delete-steps.js.map