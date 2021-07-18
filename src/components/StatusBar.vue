<template>
  <div class="status-bar">
    <div class="relative pt-1">
      <div class="flex mb-2 items-center justify-between">
        <div>
          <span
            class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200"
          >
            Task finished
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs font-semibold inline-block text-pink-600">
            {{ countPercentCompletedTodos }}%
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
        <div
          :style="{ width: `${countPercentCompletedTodos}%` }"
          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
        ></div>
      </div>
    </div>

    <ul v-if="countCompletedTodos > 0">
      <li v-for="todo in completedTodos" :key="todo.id">
        {{ todo.title }}
      </li>
    </ul>
    <ul v-else>
      <li style="color: red;">Nothing done</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  computed: {
    completedTodos() {
      return this.$store.state.todos.filter((todo) => todo.completed);
    },
    countCompletedTodos() {
      return this.$store.state.todos.filter((todo) => todo.completed).length;
    },
    countPercentCompletedTodos() {
      return Math.round(
        (this.$store.state.todos.filter((todo) => todo.completed).length /
          this.$store.state.todos.length) *
          100
      );
    },
  },
};
</script>

<style scoped>
.status-bar {
  padding: 5px;
  text-align: center;
  background: rgb(240, 240, 240);
  color: black;
}
</style>
