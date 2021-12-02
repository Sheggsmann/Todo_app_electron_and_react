import React, { Component } from "react";
import CreateTodo from "./components/createTodo";
import TodoItems from "./components/todoItems";
import "./App.css";
import bgImg from "./bg-desktop-dark.jpg";
const { ipcRenderer } = window.require("electron");

class App extends Component {
  state = {
    todoList: [],
    todoText: "",
    activeTodos: false,
  };

  componentDidMount() {
    ipcRenderer.send("get:todos");
    ipcRenderer.on("todo:list", (e, todoList) => {
      this.setState({ todoList: todoList });
    });
  }

  handleTodoInput = (data) => {
    this.setState({ todoText: data });
  };

  handleComplete = (data) => {
    const todos = [...this.state.todoList];
    const index = todos.indexOf(data);
    data.completed = !data.completed;
    todos[index] = { ...todos[index] };
    todos[index].completed = data.completed;
    this.setState({ todoList: todos });
    ipcRenderer.send("update:todo", data);
  };

  addTodo = () => {
    const todoText = this.state.todoText;
    if (!todoText) return;
    ipcRenderer.send("create:todo", todoText);
    ipcRenderer.on("todo:created", (e, todo) => {
      const todos = [...this.state.todos, todo];
      this.setState({ todoList: todos });
    });
  };

  deleteTodo = (data) => {
    let todos = [...this.state.todoList];
    todos = todos.filter((todo) => todo.id !== data.id);
    this.setState({ todoList: todos });
    ipcRenderer.send("delete:todo", data);
  };

  deleteCompleted = () => {
    let todos = [...this.state.todoList];
    todos = todos.filter((todo) => !todo.completed);
    this.setState({ todoList: todos });
    ipcRenderer.send("delete:completed");
  };

  getActiveTodos = () => {
    this.setState({ activeTodos: !this.state.activeTodos });
  };

  render() {
    let { todoList: todos, activeTodos } = this.state;
    if (activeTodos) {
      todos = todos.filter((todo) => !todo.completed);
    }

    return (
      <div className="container">
        <img src={bgImg} alt="background-img" className="bg-img" />
        <div className="content">
          <h1 className="title">TODO</h1>
          <CreateTodo
            value={this.state.todoText}
            onChange={this.handleTodoInput}
            onAdd={this.addTodo}
          />
          <TodoItems
            todoList={todos}
            onActiveTodos={this.getActiveTodos}
            onComplete={this.handleComplete}
            onDelete={this.deleteTodo}
            onDeleteCompleted={this.deleteCompleted}
          />
        </div>
      </div>
    );
  }
}

export default App;
