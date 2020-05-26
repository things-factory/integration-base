import {
  SET_INTEGRATION_MODELLER_URL,
  SET_INTEGRATION_MODELLER_AUTH_TOKEN,
  SET_INTEGRATION_MODELLER_SETTINGS
} from '../actions/integration'

const INITIAL_STATE = {
  url: '',
  token: ''
}

const integration = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_INTEGRATION_MODELLER_URL:
      return {
        ...state,
        url: action.url
      }

    case SET_INTEGRATION_MODELLER_AUTH_TOKEN:
      return {
        ...state,
        token: action.token
      }

    case SET_INTEGRATION_MODELLER_SETTINGS:
      return {
        ...state,
        url: action.url,
        token: action.token,
        username: action.username,
        password: action.password
      }

    default:
      return state
  }
}

export default integration
