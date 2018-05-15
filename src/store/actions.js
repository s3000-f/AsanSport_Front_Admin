import axios from "axios";

export default {
  setLogin: (context, p1) => {
    context.commit('setLogin', p1)
  },
  setError: (context, err) => {
    context.commit('setError', err)
  },
  resetError: context => {
    context.commit('resetError')
  },
  setUser: ({commit, state}) => {
    const config = {
      headers: {
        Authorization: 'Bearer ' + state.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    let fields = [];
    axios.get('https://api.asansport.com/v1/profile/fields', config).then(resp => {
      if (resp.status < 300) {
        fields = resp.data['data'];
      }
      else {
        console.log(resp);
      }
    }).catch(e => {
      console.log(e);
    });
    axios.get('https://api.asansport.com/v1/profile', config).then(response => {
      if (response.status < 300) {
        commit('resetError');
        let dats = response.data['data'];
        dats.fields = fields;
        commit('setUser', response.data['data']);
      }
      else {
        console.log(response.data['message'])
      }
    }).catch(e => {
      console.log(e)
    })
  },
  logout: ({commit, state}) => {
    let config = {
      headers: {
        Authorization: 'Bearer ' + state.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    axios.post('https://api.asansport.com/v1/logout', {}, config).then(response => {
      console.log(response)
    }).catch(e => {
      console.log(e)
    })
    commit('logout');
    commit('resetUser');
    commit('resetGUser');
  },
  verifyUser: context => {
    context.commit('verifyUser');
  },
  setCurrentField: (context, id) => {
    let field = [];
    axios.get('https://api.asansport.com/v1/fields/' + id).then(resp => {
      if (resp.status < 300) {
        field = resp.data['data'];
      } else {
        console.log(resp);
      }
    }).catch(e => {
      console.log(e);
    });
    context.commit('setCurrentField', field);
  }
}
