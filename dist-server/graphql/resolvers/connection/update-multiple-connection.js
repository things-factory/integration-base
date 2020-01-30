"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../../../entities");
exports.updateMultipleConnection = {
    async updateMultipleConnection(_, { patches }, context) {
        let results = [];
        const _createRecords = patches.filter((patch) => patch.cuFlag.toUpperCase() === '+');
        const _updateRecords = patches.filter((patch) => patch.cuFlag.toUpperCase() === 'M');
        const connectionRepo = typeorm_1.getRepository(entities_1.Connection);
        if (_createRecords.length > 0) {
            for (let i = 0; i < _createRecords.length; i++) {
                const newRecord = _createRecords[i];
                const result = await connectionRepo.save(Object.assign(Object.assign({}, newRecord), { domain: context.state.domain, creator: context.state.user, updater: context.state.user }));
                results.push(Object.assign(Object.assign({}, result), { cuFlag: '+' }));
            }
        }
        if (_updateRecords.length > 0) {
            for (let i = 0; i < _updateRecords.length; i++) {
                const newRecord = _updateRecords[i];
                const connection = await connectionRepo.findOne(newRecord.id);
                const result = await connectionRepo.save(Object.assign(Object.assign(Object.assign({}, connection), newRecord), { updater: context.state.user }));
                results.push(Object.assign(Object.assign({}, result), { cuFlag: 'M' }));
            }
        }
        return results;
    }
};
//# sourceMappingURL=update-multiple-connection.js.map