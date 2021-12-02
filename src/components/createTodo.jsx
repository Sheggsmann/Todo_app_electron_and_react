import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function CreateTodo({ value, onChange, onAdd }) {
  return (
    <div className="create-todo">
      <button className="btn btn-round" onClick={onAdd}>
        +
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
