import { store } from '@things-factory/shell'
import integration from './reducers/integration'

export default function bootstrap() {
  store.addReducers({
    integration
  })
}
