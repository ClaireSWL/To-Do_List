import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faGripLines,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [completedTasks, setCompletedTasks] = useState(() => {
    const savedCompletedTasks = localStorage.getItem("completedTasks");
    return savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
  });

  const dragTask = useRef(null);
  const draggedOverTask = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  function handleSort() {
    const taskClone = [...tasks];
    const temp = taskClone[dragTask.current];
    taskClone[dragTask.current] = taskClone[draggedOverTask.current];
    taskClone[draggedOverTask.current] = temp;
    setTasks(taskClone);
  }

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim()) {
      setTasks((task) => [...task, newTask]);
      setNewTask("");
    }
  }

  function editTask(index) {
    setIsEditing(index);
    setEditText(tasks[index]);
  }

  function saveTask(index) {
    if (editText.trim()) {
      const updatedTasks = tasks.map((task, i) =>
        i === index ? editText : task
      );
      setTasks(updatedTasks);
      setIsEditing(null);
      setEditText("");
    } else {
      alert("Task cannot be empty.");
    }
  }

  function handleEditChange(event) {
    setEditText(event.target.value);
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
    setCompletedTasks(completedTasks.filter((_, i) => i !== index));
  }

  function toggleComplete(index) {
    const updatedCompletedTasks = completedTasks.map((completed, i) =>
      i === index ? !completed : completed
    );
    setCompletedTasks(updatedCompletedTasks);
  }

  return (
    <div className="to_do_list">
      <h1>My Todo's</h1>
      <div>
        <div>
          <input
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={handleInputChange}
          />
          <button className="add_button" onClick={addTask}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              draggable
              onDragStart={() => (dragTask.current = index)}
              onDragEnter={() => (draggedOverTask.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
              className={`task-item ${
                completedTasks[index] ? "completed" : ""
              }`}
            >
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={completedTasks[index]}
                onChange={() => toggleComplete(index)}
              />

              {isEditing === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={handleEditChange}
                />
              ) : (
                <span className="text">{task}</span>
              )}

              {isEditing === index ? (
                <button className="save_button" onClick={() => saveTask(index)}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              ) : (
                <button className="edit_button" onClick={() => editTask(index)}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
              )}

              <button
                className="delete_button"
                onClick={() => deleteTask(index)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>

              <button className="grip_button">
                <FontAwesomeIcon icon={faGripLines} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoList;
