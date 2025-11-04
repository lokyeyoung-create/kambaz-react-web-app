import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, ListGroupItem } from "react-bootstrap";

export default function TodoItem({ todo }: { todo: { id: string; title: string } }) {
  const dispatch = useDispatch();
  
  return (
    <ListGroupItem>
      <div className="d-flex align-items-center gap-2">
        <Button 
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
          variant="danger"
          size="sm"
        > 
          Delete 
        </Button>
        <Button 
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
          variant="info"
          size="sm"
        > 
          Edit 
        </Button>
        <span>{todo.title}</span>
      </div>
    </ListGroupItem>
  );
}