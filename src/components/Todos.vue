<template>
  <div class="todo-list">
    <ul v-if="auth.isAuthenticated">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="todo.completed ? 'completed' : ''"
      >
        {{ todo.title }}
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleCompleted(todo.id)"
        />
      </li>
    </ul>
    <p v-else style="color: red; text-align: center; padding: 15px;">
      Not authenticated
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Todos",
  computed: {
    ...mapState(["todos", "auth"]),
  },
  methods: {
    toggleCompleted(todoId) {
      this.$store.commit("TOGGLE_COMPLETED", todoId);
    },
  },
};
</script>

<style>
.todo-list ul {
  padding: 0 10px 10px 10px;
  list-style-type: none;
}

.todo-list li {
  padding: 10px;
  cursor: pointer;
  margin: 10px 0;
  border-radius: 4px;
  background: rgb(240, 240, 240);
  color: black;
}

.todo-list li input[type="checkbox"] {
  -ms-transform: scale(2); /* IE */
  -moz-transform: scale(2); /* FF */
  -webkit-transform: scale(2); /* Safari and Chrome */
  -o-transform: scale(2); /* Opera */
  padding: 10px;
  float: right;
  transform: translateY(5px) scale(1.5);
}

.todo-list li button {
  float: right;
  margin-right: 20px;
}

.todo-list li button:hover {
  cursor: pointer;
  background: red;
  color: white;
}

.todo-list li.completed {
  background: rgb(119, 218, 243);
}
</style>
