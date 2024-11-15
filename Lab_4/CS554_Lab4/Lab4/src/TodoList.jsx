//import React from 'react';

function TodoList({ todos, toggleCompleted, deleteTodo }) {

    const pastDue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div>
            <h2 className="todo">Todo List</h2>
            {todos.length === 0 ?
                <p>No pending tasks.</p> :
                (
                    todos.map(todo => (
                        <div key={todo.id} className="list">
                            <h1 className={pastDue(todo.due) ? 'pastDue' : 'normal'}>{todo.title}</h1>
                            <p>{todo.description}</p>
                            <p className={pastDue(todo.due) ? 'pastDue' : 'normal'}>Due Date: {todo.due}</p>
                            <p>Completed: No</p>
                            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                            <button onClick={() => toggleCompleted(todo)}>Complete</button>
                        </div>
                    ))
                )
            }

        </div>
    );
}

export default TodoList;