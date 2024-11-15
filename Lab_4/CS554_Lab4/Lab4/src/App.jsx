import { useState } from 'react'
import TodoList from './TodoList';
import CompletedTodos from './CompletedTodos';
import './App.css'
import { v4 as uuid } from 'uuid';

function App() {

  const [todoTasks, updateTask] = useState([
    { id: uuid(), title: 'Pay cable bill', description: 'Pay the cable bill by the 15th of the month', due: '2023-11-15', completed: false },
    { id: uuid(), title: 'Grocery shopping', description: 'Buy groceries for the week', due: '2024-11-10', completed: false },
    { id: uuid(), title: 'Doctor appointment', description: 'Routine check-up', due: '2024-11-20', completed: false },
    { id: uuid(), title: 'Call the plumber', description: 'Fix the leaking sink', due: '2024-11-18', completed: false },
    { id: uuid(), title: 'Submit assignment', description: 'Submit the React assignment', due: '2024-11-25', completed: false },
    { id: uuid(), title: 'Pay rent', description: 'Pay the monthly rent', due: '2024-11-01', completed: false },
    { id: uuid(), title: 'Team meeting', description: 'Attend the project meeting', due: '2024-11-22', completed: false },
    { id: uuid(), title: 'Car maintenance', description: 'Take the car for servicing', due: '2024-11-27', completed: false },
    { id: uuid(), title: 'Dinner with friends', description: 'Dinner at the new restaurant', due: '2024-11-30', completed: false },
    { id: uuid(), title: 'Renew gym membership', description: 'Renew gym subscription', due: '2024-11-28', completed: false }
  ]);

  const deleteTodo = (id) => {
    updateTask(todoTasks.filter(todo => todo.id !== id));
  };

  const toggleCompleted = (todo) => {
    updateTask(todoTasks.map(currTodo =>
      (currTodo.id === todo.id) ? { ...currTodo, completed: !currTodo.completed } : currTodo
    ));
  };

  const todoCompletedFalse = (todo) => {
    return !todo.completed;
  };

  const todoCompletedTrue = (todo) => {
    return todo.completed;
  };

  return (
    <div>
      <h1 className="title">Todo Tracker</h1>
      <TodoList
        todos={todoTasks.filter(todoCompletedFalse)}
        toggleCompleted={toggleCompleted}
        deleteTodo={deleteTodo}
      />

      <CompletedTodos
        todos={todoTasks.filter(todoCompletedTrue)}
        toggleCompleted={toggleCompleted}
      />
    </div>
  )
}

export default App
