import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const storeData = {
  state: {
    todos: [
      { id: 1, title: "Todo 1", completed: false },
      { id: 2, title: "Todo 2", completed: false },
      { id: 3, title: "Todo 3", completed: true },
    ],
    auth: {
      isAuthenticated: false,
    },
  },
};

const store = new Vuex.Store(storeData);

export default store;
