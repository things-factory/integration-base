import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function ESCPOSPrint(step, { logger, publish, data }) {
  var { connection: connectionName, params: stepOptions } = step
  var connection = Connections.getConnection(connectionName)

  if (!connection) {
    throw new Error(`connection '${connectionName}' is not established.`)
  }

  var { device, printer } = connection

  /* make this promisify */
  device.open(function() {
    printer
      .font('a')
      .align('ct')
      .style('bu')
      .size(1, 1)
      .text('The quick brown fox jumps over the lazy dog')
      .text('안녕하십니까?')
      .barcode('1234567', 'EAN8')
      .table(['One', 'Two', 'Three'])
      .tableCustom([
        { text: 'Left', align: 'LEFT', width: 0.33 },
        { text: 'Center', align: 'CENTER', width: 0.33 },
        { text: 'Right', align: 'RIGHT', width: 0.33 }
      ])
      .qrimage('https://github.com/song940/node-escpos', function(err) {
        this.cut()
        this.close()
      })
  })

  return {
    data: true
  }
}

ESCPOSPrint.parameterSpec = []

TaskRegistry.registerTaskHandler('escpos-print', ESCPOSPrint)
