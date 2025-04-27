import React from 'react';
import './TodoCard.css'
import EditButton from "../assets/edit-4-svgrepo-com.svg"
import DeleteButton from "../assets/delete-svgrepo-com.svg"


interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'inc' | 'comp' | 'current';
}

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onComplete: (todo: Todo) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onEdit, onDelete, onComplete }) => {

  return (
    <div className="todo-card">

      <div>
        <button onClick={() => onComplete(todo)}>
          {
            todo.status == 'inc' ?
              <img src={DeleteButton} alt={todo.status} width={32} /> :
              <img src={EditButton} alt={todo.status} width={32} />
          }
        </button>
      </div>

      <div>
        <div className='todo-header'>
          <div className='titile-text'>
            <h2>{todo.title}</h2>
          </div>
          <div className='todo-actions'>
            <button onClick={() => onEdit(todo)}>
              <img src={EditButton} alt="Edit" width={32} />
            </button>
            <button onClick={() => onDelete(todo.id)}>
              <img src={DeleteButton} alt="Delete" width={32} />
            </button>
          </div>
        </div>

        <div>
          <h3>{todo.description}</h3>
        </div>
      </div>
      <div></div>
    </div>
  )

  //return (
  //  <div className="todo-card">
  //    <div className="todo-info">
  //      <div className='todo-title'>
  //        <h3>{todo.title}</h3>
  //      </div >
  //      <p>Status: {todo.status}</p>
  //      <p>{todo.description}</p>
  //    </div>
  //    <div className="todo-actions">
  //      <button onClick={() => onEdit(todo)}>Edit</button>
  //      <button onClick={() => onDelete(todo.id)}>Delete</button>
  //    </div>
  //  </div>
  //);
};

export default TodoCard;
