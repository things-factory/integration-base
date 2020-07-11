import { access } from '@things-factory/utils'
import { TaskRegistry } from '../task-registry'

async function SwitchRange(step, { logger, data }) {
  var {
    params: { accessor, cases, defaultGoto }
  } = step

  var value = Number(access(accessor, data))

  var range =
    Object.keys(cases).find(key => {
      if (key == 'default') {
        return
      }

      var [from, to] = key.split('~')

      return Number(from) <= value && Number(to) > value
    }) || 'default'

  var next = cases[range]

  logger.info(`switch-range to next '${next}' by value '${value}' .`)

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

SwitchRange.connectorFree = true

TaskRegistry.registerTaskHandler('switch-range', SwitchRange)
