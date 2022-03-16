import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const state = {
  user: {},
  opMapper: null,
  opReqMapper: null,
};

const getters = {
  user: state => state.user || {},
  opMapper: state => state.opMapper,
  opReqMapper: state => state.opReqMapper,
};

const mutations = {
  setUser(state, user) {
    state.user = user ? { ...user } : {};
  },
  setOpMapper(state, opData) {
    state.opMapper = {};
    state.opReqMapper = {};
    if (opData) {
      opData.forEach((i) => {
        state.opMapper[i.name] = i.intro;
        state.opReqMapper[i.name] = i.route;
      });
      return;
    }
    state.opMapper = null;
    state.opReqMapper = null;
  },
};

const actions = {
  async getUser({ commit }) {
    const user = await Vue.prototype.$http('/api/user/profile', 'get').catch(() => {
      commit('setUser', {});
    });
    commit('setUser', user);
  },
  setUser({ commit }, user) {
    if (user) {
      commit('setUser', user);
    }
  },
  clearUser({ commit }) {
    commit('setUser', {});
  },
  async getEnv({ commit }) {
    const res = await Vue.prototype.$http('/env/all', 'get').catch(() => {
      commit('setOpMapper', null);
    });
    commit('setOpMapper', res || null);
  },
};


export default new Vuex.Store({
  state, getters, mutations, actions,
});
