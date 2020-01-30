"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TaskRegistry {
    static getTaskHandler(type) {
        return TaskRegistry.handlers[type];
    }
    static registerTaskHandler(type, handler) {
        TaskRegistry.handlers[type] = handler;
    }
    static unregisterTaskHandler(type) {
        delete TaskRegistry.handlers[type];
    }
    static getTaskHandlers() {
        return Object.assign({}, TaskRegistry.handlers);
    }
}
exports.TaskRegistry = TaskRegistry;
TaskRegistry.handlers = {};
//# sourceMappingURL=task-registry.js.map