import { access } from '@things-factory/utils'
import { TaskRegistry } from '../task-registry'

async function Log(step, { logger, data }) {
  var {
    params: { message, accessor, level = 'info' }
  } = step

  message = access(accessor, data) || message
  if (typeof message !== 'string') {
    message = JSON.stringify(message, null, 2)
  }

  switch (level) {
    case 'error':
      logger.error(message)
      return
    case 'warn':
      logger.warn(message)
      return
    default:
      logger.info(message)
  }

  return {
    data: message
  }
}

Log.parameterSpec = [
  {
    type: 'string',
    name: 'accessor',
    label: 'accessor'
  },
  {
    type: 'string',
    name: 'message',
    label: 'message'
  },
  {
    type: 'select',
    name: 'level',
    label: 'level',
    property: {
      options: ['info', 'warn', 'error']
    }
  }
]

Log.connectorFree = true

TaskRegistry.registerTaskHandler('log', Log)
