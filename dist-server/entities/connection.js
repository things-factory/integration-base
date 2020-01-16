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
const engine_1 = require("../engine");
let Connection = class Connection {
    async connect() {
        try {
            var connector = engine_1.Connections.getConnector(this.type);
            await connector.connect(this);
            this.status = 1;
        }
        catch (ex) {
            this.status = 0;
        }
    }
    async disconnect() {
        try {
            var connector = engine_1.Connections.getConnector(this.type);
            await connector.disconnect(this.name);
        }
        finally {
            this.status = 0;
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Connection.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => shell_1.Domain),
    __metadata("design:type", typeof (_a = typeof shell_1.Domain !== "undefined" && shell_1.Domain) === "function" ? _a : Object)
], Connection.prototype, "domain", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Connection.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Connection.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Connection.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Connection.prototype, "endpoint", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", Boolean)
], Connection.prototype, "active", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", Number)
], Connection.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", String)
], Connection.prototype, "params", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Connection.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Connection.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => auth_base_1.User, {
        nullable: true
    }),
    __metadata("design:type", typeof (_b = typeof auth_base_1.User !== "undefined" && auth_base_1.User) === "function" ? _b : Object)
], Connection.prototype, "creator", void 0);
__decorate([
    typeorm_1.ManyToOne(type => auth_base_1.User, {
        nullable: true
    }),
    __metadata("design:type", typeof (_c = typeof auth_base_1.User !== "undefined" && auth_base_1.User) === "function" ? _c : Object)
], Connection.prototype, "updater", void 0);
Connection = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Index('ix_connection_0', (connection) => [connection.domain, connection.name], { unique: true })
], Connection);
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map