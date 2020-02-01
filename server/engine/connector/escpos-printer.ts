import { logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'
import { Printer, USB, Network, Serial } from 'escpos'

export class ESCPOSPrinter implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('escpos-printer connections are ready')
  }

  async connect(connection) {
    const {
      encoding = 'KS_C_5601-1987',
      vendorId = 0x0483 /* STMicroelectronics */,
      productId = 0x5743 /* XPrinter Product ? */
    } = connection.params

    const device = new USB(Number(vendorId), Number(productId))
    // const device  = new Network('localhost');
    // const device  = new Serial('/dev/usb/lp0');

    const options = { encoding }
    const printer = new Printer(device, options)

    Connections.addConnection(connection.name, {
      device,
      printer
    })
  }

  async disconnect(name) {
    let { device } = Connections.removeConnection(name)

    await device.close()
  }

  get parameterSpec() {
    return [
      {
        type: 'select',
        label: 'encoding',
        name: 'encoding',
        property: {
          options: ['', 'KS_C_5601-1987', 'GB18030']
        }
      },
      {
        type: 'string',
        label: 'vendorId',
        placeholder: '0x0483',
        name: 'vendorId'
      },
      {
        type: 'string',
        label: 'productId',
        placeholder: '0x5743',
        name: 'productId'
      }
    ]
  }
}

Connections.registerConnector('escpos-printer', new ESCPOSPrinter())
