import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";
import { Button, FormControl, ListGroupItem } from "react-bootstrap";

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();
  
  return (
    <ListGroupItem>
      <div className="d-flex align-items-center gap-2">
        <Button 
          onClick={() => dispatch(addTodo(todo))}
          id="wd-add-todo-click"
          variant="success"
          size="sm"
        > 
          Add 
        </Button>
        <Button 
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
          variant="warning"
          size="sm"
        > 
          Update 
        </Button>
        <FormControl
          value={todo.title}
          onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
          placeholder="Enter todo title"
        />
      </div>
    </ListGroupItem>
  );
}