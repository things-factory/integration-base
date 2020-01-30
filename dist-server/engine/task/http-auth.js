"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AUTH_HEADERS = {
    basic({ username = '', password = '' }) {
        return {
            Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
        };
    }
};
function GET_AUTH_HEADERS(authOption) {
    var { authtype: type } = authOption || {};
    if (!type || !AUTH_HEADERS[type]) {
        return;
    }
    return AUTH_HEADERS[type].call(null, authOption);
}
exports.GET_AUTH_HEADERS = GET_AUTH_HEADERS;
//# sourceMappingURL=http-auth.js.map