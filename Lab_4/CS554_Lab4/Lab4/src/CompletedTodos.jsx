
function CompletedTodos({ todos, toggleCompleted }) {

    return (
        <div>
            <h2 className="completed">Completed Todos</h2>
            {todos.length === 0 ?
                <p>No completed tasks.</p> :
                (
                    todos.map(todo => (
                        <div key={todo.id} className="list">
                            <h1>{todo.title}</h1>
                            <p>{todo.description}</p>
                            <p>Due Date: {todo.due}</p>
                            <p>Completed: Yes</p>
                            <button onClick={() => toggleCompleted(todo)}>Mark Incomplete</button>
                        </div>
                    ))
                )
            }

        </div>
    );
}

export default CompletedTodos;