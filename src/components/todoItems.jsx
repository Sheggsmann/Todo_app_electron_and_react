import React from "react";
import TodoItem from "./todoItem";
import { useHotkeys } from "react-hotkeys-hook";

export default function TodoItems({
  todoList,
  onActiveTodos,
  onComplete,
  onDelete,
  onDeleteCompleted,
}) {
  useHotkeys("c", () => {
    onDeleteCompleted();
  });

  useHotkeys("a", () => {
    onActiveTodos();
  });

  return (
    <div className="todoitems-container">
      {todoList.map((todoItem) => (
        <TodoItem
          key={"todo-item-" + todoItem.id}
          todoListItem={todoItem}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
      <div className="todoitems-footer">
        <p>{todoList.filter((item) => !item.completed).length} Items Left</p>
        <button onClick={onDeleteCompleted}>Clear Completed</button>
      </div>
    </div>
  );
}
