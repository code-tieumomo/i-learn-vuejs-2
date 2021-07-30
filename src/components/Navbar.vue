<template>
  <div class="navbar">
    <h1>Vuex Todo App</h1>
    <ul>
      <li>Home</li>
      <li>About</li>
      <li v-if="auth.isAuthenticated">
        Total todos: {{ todos.length }}
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          @click="TOGGLE_AUTH"
        >
          Logout
        </button>
      </li>
      <li v-else>
        <button
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          @click="TOGGLE_AUTH"
        >
          Login
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Navbar",
  computed: mapState(["todos", "auth"]),
  methods: mapMutations(["TOGGLE_AUTH"]),
};
</script>

<style>
.navbar {
  padding: 5px;
  text-align: center;
  background: rgb(240, 240, 240);
  color: black;
}

.navbar ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  padding: 0;
}
</style>
