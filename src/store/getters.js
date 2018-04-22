export default {
  getToken: state => {
    return state.token
  },
  isLogged: state => {
    return state.isLoggedin
  },
  getErrors: state => {
    return state.errorMsg
  }
}
