import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TodoCard from '../../components/TodoCard';
import "./Home.css"


const FETCH_TODO = 'http://localhost:8000/api/todo_list';
const DELETE_TODO = 'http://localhost:8000/api/todo';
const UPDATE_TODO = 'http://localhost:8000/api/todo';
const ADD_TODO = 'http://localhost:8000/api/create_todo';


interface Todo {
    id: number;
    title: string;
    description: string;
    status: 'inc' | 'comp' | 'current';
}

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [status, setStatus] = useState('inc');
    const [editingTodoId, setEditingTodoId] = useState();
    const [authToken, setAuthToken] = useState<string>('');
    const [newTodoDesc, setNewTodoDesc] = useState<any>('');
    const [newTodoTitle, setNewTodoTitle] = useState<any>('');
    const [user, setUser] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const current_user = localStorage.getItem('username');

        console.log("\nJWT token => ", token)
        if (!token) {
            navigate('/login');
        } else {
            console.log("Setting token........", token)
            setAuthToken(token)
            setUser(current_user)
            console.log("After Setting token........", authToken)
        }
    }, [authToken]);

    useEffect(() => {
        fetchTodos()
    }, [authToken]);

    const fetchTodos = async () => {
        try {
            console.log("JWT before request => ", authToken)
            const response = await axios.get(FETCH_TODO, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setTodos(response.data.data);
            console.log("\nTodo from response => ", response.data)
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Error in Logut :', error);
        }
    }

    const createTodo = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(ADD_TODO, {
                title: newTodoTitle,
                description: newTodoDesc,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                alert('Added ToDo!');
                setNewTodoTitle('')
                setNewTodoDesc('')
                fetchTodos()
            }
        } catch (error) {
            console.error('Unable to add Todo =>', error);
            alert('Failed to add Todo');
        }
    }

    const toggleTodo = async (todo: Todo) => {

        const toggledTodo = todo.status == 'inc' ? 'comp' : 'inc'
        try {
            const response = await axios.patch(`${UPDATE_TODO}/${todo.id}`, {
                status: toggledTodo
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                alert('Updated Todo!');
                fetchTodos()
            }
        } catch (error) {
            console.error('Unable to add Todo =>', error);
            alert('Failed to add Todo');
        }
    }

    const deleteTodo = async (id: number) => {
        try {
            console.log("Todo to be deleted => ", id)
            const response = await axios.delete(`${DELETE_TODO}/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            },);
            if (response.status === 200) {
                alert('Deleted Todo');
                fetchTodos()
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleEdit = (todo: Todo) => {
        //setTask(todo.task);
        //setStatus(todo.status);
        //setEditingTodoId(todo.id);
    };

    return (
        <div className="mainContainer">
            <div className='header-nav'>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <h1>{user}'s Todo</h1>

            <form onSubmit={createTodo} className='add-todo-form'>
                <div className='create-todo-input-field'>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        required
                    />
                </div>

                <div className='create-todo-input-field'>
                    <input
                        type="text"
                        placeholder="Description"
                        value={newTodoDesc}
                        onChange={(e) => setNewTodoDesc(e.target.value)}
                        required
                    />
                </div>

                <div className='submit-button'>
                    <button type="submit">Add Todo</button>
                </div>
            </form>

            {/* Todo list */}
            <div className="todo-list">
                {todos.length === 0 ? (
                    <p>No todos found!</p>
                ) : (
                    todos.map((todo: Todo) => (
                        <TodoCard
                            key={todo.id}
                            todo={todo}
                            onEdit={handleEdit}
                            onDelete={deleteTodo}
                            onComplete={toggleTodo}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;

