"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const shell_1 = require("@things-factory/shell");
const auth_base_1 = require("@things-factory/auth-base");
const step_1 = require("./step");
const engine_1 = require("../engine");
let Scenario = class Scenario {
    async start(initData) {
        try {
            await engine_1.ScenarioEngine.load(this, initData);
            this.status = 1;
        }
        catch (ex) {
            this.status = 0;
        }
    }
    async stop() {
        try {
            await engine_1.ScenarioEngine.unload(this.name);
        }
        finally {
            this.status = 0;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Scenario.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => shell_1.Domain),
    __metadata("design:type", typeof (_a = typeof shell_1.Domain !== "undefined" && shell_1.Domain) === "function" ? _a : Object)
], Scenario.prototype, "domain", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Scenario.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Scenario.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", Boolean)
], Scenario.prototype, "active", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", Number)
], Scenario.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Scenario.prototype, "schedule", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Scenario.prototype, "timezone", void 0);
__decorate([
    typeorm_1.OneToMany(type => step_1.Step, step => step.scenario),
    __metadata("design:type", Array)
], Scenario.prototype, "steps", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Scenario.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Scenario.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => auth_base_1.User, {
        nullable: true
    }),
    __metadata("design:type", typeof (_b = typeof auth_base_1.User !== "undefined" && auth_base_1.User) === "function" ? _b : Object)
], Scenario.prototype, "creator", void 0);
__decorate([
    typeorm_1.ManyToOne(type => auth_base_1.User, {
        nullable: true
    }),
    __metadata("design:type", typeof (_c = typeof auth_base_1.User !== "undefined" && auth_base_1.User) === "function" ? _c : Object)
], Scenario.prototype, "updater", void 0);
Scenario = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Index('ix_scenario_0', (scenario) => [scenario.domain, scenario.name], { unique: true })
], Scenario);
exports.Scenario = Scenario;
//# sourceMappingURL=scenario.js.map