'use strict';

( function(){

    let todos = [];
    let todosPending = [];
    let index = 0;

    const todoDay = document.querySelector('.header__day');
    const todoDate = document.querySelector('.header__date');
    const addTodoBtn = document.querySelector('.btn--add');
    const todoInput = document.querySelector('.todo__input');
    const todoListPending = document.querySelector('.content__pending');
    const counter = document.querySelector('.counter');
    const clearAllBtn = document.querySelector('.btn--clear');
    const todoListDone = document.querySelector('.content__done');
    const showDoneListBtn = document.querySelector('.btn--complete');
    const doneListContainer = document.querySelector('.doneList--show');
    const doneListHideBtn = document.querySelector('.btn--hide');

    // Localstorage handler object.
    const localDB = {
        setItem(key, value) {
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        },
        getItem(key) {
            const value = localStorage.getItem(key);
            if (!value) {
                return null;
            }
            return JSON.parse(value);
        },
        removeItem(key) {
            localStorage.removeItem(key);
        }
    };

    // Initialize application.
    const init = () => {
        showDate();
        loadexistingTodos();
        setListeners();
        makedTodoListener();
        pengingCounterStep();
    };

    // Load existing todos.
    const loadexistingTodos = () => {
        const savedTodos = localDB.getItem('todos');
        if (savedTodos) {
            todos = savedTodos;
        }
        if (todos && Array.isArray(todos)) {
            todos.forEach( todo => {
                if (todo.done) {
                    showTodoDone(todo, todoListDone);
                } else {
                    showTodo(todo, todoListPending);
                };
            });
        };
    };

    // Show date.
    const showDate = () => {
        const currentDate = new Date();
        let options = { weekday: 'long' };
        const day = [
            currentDate.getMonth() + 1,
            currentDate.getDate(),
            currentDate.getFullYear(),
        ].map( num => num < 10 ? `0${num}` : num);
        
        todoDay.textContent = new Intl.DateTimeFormat('en-GB', options).format(currentDate);
        todoDate.textContent = day.join('-');
    };

    // Set event listeners.
    const setListeners = () => {
        addTodoBtn.addEventListener('click', addNewTodo);
        clearAllBtn.addEventListener('click', deleteAllTodo);
        showDoneListBtn.addEventListener('click', showDoneList);
        doneListHideBtn.addEventListener('click', hideDoneList);

    };
    
    const makedTodoListener = () => {
        document.querySelectorAll('.btn--dell').forEach( item => {
            item.addEventListener('click', deleteTodo )
        });
        document.querySelectorAll('.add-todo').forEach( item => {
            item.addEventListener('click', addDoneTodo )
        });
        document.querySelectorAll('.to-do').forEach( item => {
            item.addEventListener('mouseover', 
                ev => ev.currentTarget.classList.add('hovered') 
            );        
            item.addEventListener('mouseleave', 
            ev => ev.currentTarget.classList.remove('hovered') 
            );
        });
    };

    // Save and add todo to
    const addNewTodo = () => {
        todos.forEach( item => {            
            if (item.id == index) {
                index += 1;
            }
        });
        const value = todoInput.value;
        if ( value === '') {
            alert('Please type a todo.');
            return;
        };        
        const todo = { text: value, done: false, id: index,};
        todos.push(todo);
        todosPending.push(todo);
        localDB.setItem('todos', todos);
        showTodo(todo, todoListPending);
        todoInput.value = ''; 
        index += 1; 
        makedTodoListener();
        pengingCounterStep();
    };

    const showTodo = (todo, parentTodo) => {
        const todoItem = document.createElement('div');        
        parentTodo.appendChild(todoItem);
        todoItem.classList.add('to-do');
        todoItem.dataset.id = todo.id;

        todoItem.innerHTML=`
        <input type="checkbox" class="add-todo"><span>${todo.text}</span>
        <button class="btn--dell"><i class="fa fa-trash"></i></button>
        `;
        parentTodo.insertBefore(todoItem, parentTodo.firstChild);
    }; 

    const showTodoDone = (todo, parentTodo) => {
        const todoItem = document.createElement('div');        
        parentTodo.appendChild(todoItem);
        todoItem.classList.add('to-do-done');
        todoItem.dataset.id = todo.id;

        todoItem.innerHTML=`
        <input type="checkbox" class="add-done" checked><span>${todo.text}</span>
        `;
        parentTodo.insertBefore(todoItem, parentTodo.firstChild);
    }; 

    const deleteTodo = (event) => {
        const deleteIndex = event.currentTarget.parentElement.dataset.id
        console.log(deleteIndex);
        todos.forEach( item => {
            if ( item.id == deleteIndex) {
                todos.pop(item);
                todosPending.pop(item);
            };
        })
        localDB.removeItem('todos');
        localDB.setItem('todos', todos);
        event.currentTarget.parentElement.remove();
        pengingCounterStep();
    };

    const pengingCounterStep = () => {
        counter.textContent = todosPending.length;
    };

    const deleteAllTodo = () => {
        localDB.removeItem('todos')
        todos = [];
        todosPending = [];
        document.querySelectorAll('.to-do').forEach( item => item.remove());
        counter.textContent = 0;
    };

    const addDoneTodo = (event) => {
        const doneIndex = event.currentTarget.parentElement.dataset.id
        todos.forEach( item => {
            if ( item.id == doneIndex) {
                item.done = true;
                todosPending.pop(item);
                showTodoDone(item, todoListDone);
            };
            removeTodoElement(doneIndex);
            localDB.removeItem('todos');
            localDB.setItem('todos', todos);
        })
    };

    const removeTodoElement = (doneId) => {
        document.querySelectorAll('.to-do').forEach( item => {
            if (doneId === item.dataset.id) {
                item.remove();
            }

        })
    }

    const showDoneList = () => {
        doneListContainer.classList.remove('non-visible');
        doneListHideBtn.classList.remove('non-visible');
        showDoneListBtn.classList.add('non-visible');
    };

    const hideDoneList = () => {
        doneListHideBtn.classList.add('non-visible');
        doneListContainer.classList.add('non-visible');
        showDoneListBtn.classList.remove('non-visible');
    }


    init();
    
})();
