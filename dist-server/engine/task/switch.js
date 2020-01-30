"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_registry_1 = require("../task-registry");
function getValue(accessor, o) {
    var accessors = String(accessor)
        .trim()
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.')
        .filter(accessor => !!accessor.trim());
    return accessors.reduce((o, accessor) => (o ? o[accessor] : undefined), o);
}
async function Switch(step, { logger, data }) {
    var { params: { accessor, cases: jsonCases, defaultGoto } } = step;
    var value = getValue(accessor, data);
    var cases = JSON.parse(jsonCases);
    var goto = cases[value];
    return {
        next: goto === undefined ? defaultGoto : goto
    };
}
Switch.parameterSpec = [
    {
        /*
          data[httpget][xxx][yyy][zzz] => accessor
          data[httpget][xxx][yyy][zzz].toString() => script
        */
        type: 'string',
        name: 'accessor',
        label: 'accessor'
    },
    {
        /*
          {
            'a': 'step 1',
            'b': 'step 2',
            10: 'step 3'
          },
    
          [{
            key: 'a',
            step: 'step 1'
          }, {
            key: 'b',
            step: 'step 2'
          }, {
            key: 10,
            step: 'step 3'
          }, {
            key: 11,
            step:
          }]
        */
        type: 'textarea',
        name: 'cases',
        label: 'cases'
    },
    {
        type: 'string',
        name: 'defaultGoto',
        label: 'defaultGoto'
    }
];
task_registry_1.TaskRegistry.registerTaskHandler('switch', Switch);
//# sourceMappingURL=switch.js.map