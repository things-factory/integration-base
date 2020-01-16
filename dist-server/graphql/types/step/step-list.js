"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.StepList = graphql_tag_1.default `
  type StepList {
    items: [Step]
    total: Int
  }
`;
//# sourceMappingURL=step-list.js.map