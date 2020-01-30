"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection = __importStar(require("./connection"));
const Scenario = __importStar(require("./scenario"));
const Step = __importStar(require("./step"));
const Connector = __importStar(require("./connector"));
const TaskType = __importStar(require("./task-type"));
const PublishData = __importStar(require("./publish-data"));
exports.queries = [Connection.Query, Scenario.Query, Step.Query, Connector.Query, TaskType.Query];
exports.mutations = [Connection.Mutation, Scenario.Mutation, Step.Mutation];
exports.subscriptions = [Scenario.Subscription, PublishData.Subscription];
//# sourceMappingURL=index.js.map