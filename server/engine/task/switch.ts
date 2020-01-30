import { TaskRegistry } from '../task-registry'

function getValue(accessor, o) {
  var accessors = String(accessor)
    .trim()
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')
    .filter(accessor => !!accessor.trim())

  return accessors.reduce((o, accessor) => (o ? o[accessor] : undefined), o)
}

async function Switch(step, { logger, data }) {
  var {
    params: { accessor, cases }
  } = step

  var value = getValue(accessor, data)

  var next = cases[value] || cases['default']

  return {
    next
  }
}

Switch.parameterSpec = [
  {
    type: 'string',
    name: 'accessor',
    label: 'accessor'
  },
  {
    type: 'map',
    name: 'cases',
    label: 'cases'
  }
]

TaskRegistry.registerTaskHandler('switch', Switch)

async function SwitchRange(step, { logger, data }) {
  var {
    params: { accessor, cases, defaultGoto }
  } = step

  var value = Number(getValue(accessor, data))

  var range =
    Object.keys(cases).find(key => {
      if (key == 'default') {
        return
      }

      var [from, to] = key.split('~')

      return Number(from) <= value && Number(to) > value
    }) || 'default'

  var next = cases[range]

  return {
    next
  }
}

SwitchRange.parameterSpec = [
  {
    type: 'string',
    name: 'accessor',
    label: 'accessor'
  },
  {
    type: 'range',
    name: 'cases',
    label: 'cases'
  }
]

TaskRegistry.registerTaskHandler('switch-range', SwitchRange)
