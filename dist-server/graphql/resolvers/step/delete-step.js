"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.deleteStep = {
    async deleteStep(_, { name }, context) {
        await typeorm_1.getRepository(entities_1.Step).delete({ domain: context.state.domain, name });
        return true;
    }
};
//# sourceMappingURL=delete-step.js.map