import Vue from 'vue'
import Vuex from 'vuex'

// Para decodificar el jwt
import decode from 'jwt-decode'

import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    usuarioDB: ''
  },
  mutations: {
    obtenerUsuario(state, payload) {
      state.token = payload;
      if (payload === '') {
        state.usuarioDB = '';
      } else {
        state.usuarioDB = decode(payload);
        // router.push({ name: 'Notas' })
      }
    }
  },
  actions: {
    guardarUsuario({commit}, payload) {
      localStorage.setItem('token', payload);
      commit('obtenerUsuario', payload);
    },
    cerrarSesion({commit}) {
      commit('obtenerUsuario', '');
      localStorage.removeItem('token');
      router.push({ name: 'Login' });
    },
    leerToken({commit}) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('obtenerUsuario', token);
      } else {
        commit('obtenerUsuario', '');
        router.push({ name: 'Login' });
      }
    }
  },
  getters: {
    estaActivo: state => !!state.token
  }
})
