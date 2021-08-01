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
    game: {
      isGame: false,
    },
  },
  getters: {
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
    countCompletedTodos: (state) =>
      state.todos.filter((todo) => todo.completed).length,
    countPercentCompletedTodos: (state, getters) =>
      Math.round((getters.countCompletedTodos / state.todos.length) * 100),
  },
  mutations: {
    TOGGLE_AUTH(state) {
      state.auth.isAuthenticated = !state.auth.isAuthenticated;
    },
    TOGGLE_COMPLETED(state, todoId) {
      state.todos.map((todo) => {
        if (todo.id === todoId) {
          todo.completed = !todo.completed;

          return todo;
        }
      });
    },
  },
};

const store = new Vuex.Store(storeData);

export default store;
