"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shell_1 = require("@things-factory/shell");
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.stepsResolver = {
    async steps(_, params, context) {
        const convertedParams = shell_1.convertListParams(params, context.state.domain.id);
        const [items, total] = await typeorm_1.getRepository(entities_1.Step).findAndCount(Object.assign(Object.assign({}, convertedParams), { relations: ['domain', 'scenario', 'creator', 'updater'] }));
        return { items, total };
    }
};
//# sourceMappingURL=steps.js.map