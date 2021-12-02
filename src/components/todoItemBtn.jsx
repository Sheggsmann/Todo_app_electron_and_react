import React from "react";

export default function TodoItemBtn({ todoListItem, onComplete }) {
  let styles = "btn todoitem-btn ";
  if (todoListItem.completed) styles += "completed";
  return (
    <button className={styles} onClick={() => onComplete(todoListItem)}>
      {todoListItem.completed && <>&#10003;</>}
    </button>
  );
}
