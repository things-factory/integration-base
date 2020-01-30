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
const scenario_1 = require("./scenario");
let Step = class Step {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Step.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => shell_1.Domain),
    __metadata("design:type", typeof (_a = typeof shell_1.Domain !== "undefined" && shell_1.Domain) === "function" ? _a : Object)
], Step.prototype, "domain", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Step.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Step.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => scenario_1.Scenario, scenario => scenario.steps, { onDelete: 'CASCADE' }),
    __metadata("design:type", scenario_1.Scenario)
], Step.prototype, "scenario", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Step.prototype, "sequence", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Step.prototype, "task", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Step.prototype, "connection", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Step.prototype, "params", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Step.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Step.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => auth_base_1.User, {
        nullable: true
    }),
    __metadata("design:type", typeof (_b = typeof auth_base_1.User !== "undefined" && auth_base_1.User) === "function" ? _b : Object)
], Step.prototype, "creator", void 0);
__decorate([
    typeorm_1.ManyToOne(type => auth_base_1.User, {
        nullable: true
    }),
    __metadata("design:type", typeof (_c = typeof auth_base_1.User !== "undefined" && auth_base_1.User) === "function" ? _c : Object)
], Step.prototype, "updater", void 0);
Step = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Index('ix_step_0', (step) => [step.scenario, step.sequence], { unique: true })
], Step);
exports.Step = Step;
//# sourceMappingURL=step.js.map