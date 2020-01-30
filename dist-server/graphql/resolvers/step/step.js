"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.stepResolver = {
    async step(_, { name }, context) {
        return await typeorm_1.getRepository(entities_1.Step).findOne({
            where: { domain: context.state.domain, name },
            relations: ['domain', 'scenario', 'creator', 'updater']
        });
    }
};
//# sourceMappingURL=step.js.map