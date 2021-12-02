const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: isProd
    ? path.join(process.resourcesPath, "database.sqlite")
    : path.join(__dirname, "database.sqlite"),
});

const Todo = sequelize.define("Todo", {
  name: DataTypes.TEXT,
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

async function createTodo(name) {
  const todo = await Todo.create({ name });
  return todo;
}

async function updateTodo(id, completed) {
  const todo = await Todo.findByPk(id);
  todo.update({ completed });
  return todo;
}

async function deleteTodo(id) {
  const todo = await Todo.findByPk(id);
  todo.destroy();
  return todo;
}

async function deleteCompleted() {
  await Todo.destroy({
    where: {
      completed: true,
    },
  });
}

async function getTodo() {
  return await Todo.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function createDb() {
  await sequelize.sync();
}

module.exports = {
  createDb,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompleted,
  getTodo,
};
