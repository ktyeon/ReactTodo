// Importing necessary dependencies and styles
import './App.css';
import { useEffect, useRef, useState } from 'react';
import firebase from './firebase'; // Update the path based on your project structure

// Main component function
function App() {

  // State for managing the todo list and sequence
  const [todoList, setTodoList] = useState([]);
  const [sequance, setSequance] = useState(null);

  // Reference to input field for adding new todos
  const refTodoItem = useRef();

  // useEffect hook to run once when the component mounts
  useEffect(() => {

    // Retrieve sequence and initialize if not present in localStorage
    let sequance = window.localStorage.getItem("sequance");

    if (sequance === null) {
      window.localStorage.setItem("sequance", "0");
      sequance = 0;
    }



    // Function to handle initial setup of todo list
    const handleSetInit = () => {
      window.localStorage.setItem("todolist", "[]");
      return "[]";
    };

    // Retrieve todo list from localStorage or initialize
    let todo = JSON.parse(window.localStorage.getItem("todolist") ?? handleSetInit());

    // Set state with retrieved data
    setTodoList(todo);
    setSequance(Number(sequance));
  }, []);

   // Reference to Firebase database
   const db = firebase.database().ref('todoList');

   // useEffect hook to sync with Firebase on component mount
   useEffect(() => {
     // Set up a listener for changes in the todo list
     db.on('value', (snapshot) => {
       const data = snapshot.val();
       if (data) {
         setTodoList(data.todoList || []);
         setSequance(data.sequance || null);
       }
     });
 
     return () => {
       // Clean up the listener when the component unmounts
       db.off();
     };
   }, [db]);
 

  // Function to handle adding a new todo
  const handleTodoAdd = (item) => {

    // Check if sequence is available
    if (sequance === null) {
      return;
    }

    // Copy the existing todo list
    let todo = [...todoList];

    // Add the new todo with updated sequence
    todo.push({ tf: false, id: sequance + 1, text: item });

    // Update localStorage with the new todo list and sequence
    window.localStorage.setItem("todoList", JSON.stringify(todo));
    window.localStorage.setItem("sequance", String(sequance + 1));

    // Update state and clear the input field
    setTodoList(todo);
    setSequance(sequance + 1);
    refTodoItem.current.value = '';

    // Update Firebase with the new todo list and sequence
    db.set({ todoList, sequance: sequance + 1 });

  };

  // Function to handle checking/unchecking a todo
  const handleTodoCheck = (tf, idx) => {

    // Copy the existing todo list
    let todo = [...todoList];

    // Toggle the 'tf' (done) property of the clicked todo
    todo[idx].tf = !tf;

    // Update localStorage with the updated todo list
    window.localStorage.setItem("todoList", JSON.stringify(todo));

    // Update state with the modified todo list
    setTodoList(todo);

    // Update Firebase with the updated todo list
    db.child('todoList').set(todoList);

  };

  // Function to handle deleting a todo
  const handleTodoDelete = (id) => {

    // Copy the existing todo list
    let todo = [...todoList];

    // Filter out the todo with the specified id
    todo = todo.filter((val) => val.id !== id);

    // Update localStorage with the modified todo list
    window.localStorage.setItem("todoList", JSON.stringify(todo));

    // Update state with the filtered todo list
    setTodoList(todo);

    // Update Firebase with the modified todo list
    db.child('todoList').set(todoList);
  };

  // JSX structure for the component
  return (
    <div className='mainLayout'>
      <div className='todoLayout'>
        <div className='todoTop'>
          <div className='todoTitle'>
            ToDo List
          </div>
          <div className='todoAdd'>
            {/* Input field for entering new todos */}
            <input type='text' placeholder='Enter your plans' ref={refTodoItem}/>
            {/* Button to add a new todo */}
            <div onClick={() => handleTodoAdd(refTodoItem.current.value)}>
              +
            </div>
          </div>
        </div>
        <div className='listLayout'>

          {/* Rendering the todo list */}
          {todoList.map((val, idx) => (
            <div className='todoItem' key={idx}>

              {/* Checkbox for marking a todo as done */}
              <div className='todoCheckBox' onClick={() => handleTodoCheck(val.tf, idx)}>
                <div className='checkIcon'>
                  {val.tf ? '✔️' : ''}
                </div>
                <span>To do</span>
              </div>

              {/* Displaying the text of the todo */}
              {val.text}

              {/* Button to delete a todo */}
              <div className='deleteBox' onClick={() => handleTodoDelete(val.id)}>
                X
              </div>

            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}

// Exporting the component as the default export
export default App;
