import React from "react";
import TodoItemBtn from "./todoItemBtn";

export default function TodoItem({ todoListItem, onComplete, onDelete }) {
  let styles = "todoitem ";
  if (todoListItem.completed) styles += "complete";
  return (
    <div className={styles}>
      <TodoItemBtn todoListItem={todoListItem} onComplete={onComplete} />
      <p>{todoListItem.name}</p>
      <button className="delete-btn" onClick={() => onDelete(todoListItem)}>
        x
      </button>
    </div>
  );
}
