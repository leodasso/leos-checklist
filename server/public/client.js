$(document).ready(onReady);

// setup date formatter
const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };

function onReady() {

    // fetch the todo list from the server (so it can be populated on the DOM)
    fetchTodoItems();

    /*      |----------------------------------------|
            |    ~~~~create button listeners~~~~~    |
            |________________________________________| */
    // 'new item' button
    $('#checklist-container').on('click', '.new-button', sendNewTodo);

    // 'delete' button
    $('#checklist-container').on('click', '.delete-button', deleteItem);

    // 'toggle' button
    $('#checklist-container').on('click', '.toggle-button', toggleTodoItem);
}

// Toggles the 'complete' status of the item. If it's complete, uncompletes,
// and if it's not complete, completes it. 
function toggleTodoItem() {

    // find the taskbox which is the parent of this button. It contains the data
    const taskBox = $(this).closest('.task-box');

    const isComplete    = taskBox.data().complete;
    const id            = taskBox.data().id;

    console.log(isComplete);
    

    $.ajax({
        url: `/todo-list/${id}`,
        type: 'PUT',
        data: {complete: isComplete
        }
    }).then(fetchTodoItems);
    
}

// Fetches all the todo items from the server, and calls rebuild
// in order to refresh the page with the new info
function fetchTodoItems() {

    $.ajax({
        url: '/todo-list',
        type: 'GET'
    })
    .then(
        result => {
            rebuildTodoList(result);
        }
    ).catch(
        error => {
            // TODO tell user there was an error
            console.log('error communicating with server', error);
        }
    );

}

// sends a new todo to the server
function sendNewTodo() {

    let newInput = $('#new-input');
    console.log(newInput.val());
    
    if (newInput.val() == '') {
        window.alert('please enter a message for your new to-do!');
        return;
    }

    // create a new todo object
    let todayDate = new Date();
    let newTodo = {
        descr: newInput.val(),
        date: todayDate.toDateString()
    }
    
    // send it to the server
    $.ajax( {
        type: 'POST',
        url: '/todo-list',
        data: newTodo
    })
    .then(fetchTodoItems);
}

function rebuildTodoList(todoArray) {

    // get the checklist container
    const container = $('#checklist-container');
    container.empty();

    for (element of todoArray) {

        // get a nicely formatted date
        const date = new Date(element.date);
        const formattedDate = date.toLocaleDateString("en-US", dateFormat);

        // determine which classes to put based on if it's complete or not
        let classes = 'task-box';
        if (element.complete) classes += ' complete';

        const html = 
            `<div class="${classes}" data-id="${element.id}" data-complete="${element.complete}">
                <button class="toggle-button">Toggle</button>
                <button class="delete-button">X</button>
                <div>${formattedDate}</div>
                <p>${element.descr}</p>
            </div>
        `;

        container.append(html);
    }

    // append the 'new todo' element after all the others
    const newItemHtml = `
        <div class="task-box">
            <input type="text" id="new-input" placeholder "new To-Do">
            <button class="new-button">Add</button>
        </div>`;

    container.append(newItemHtml);
}

function deleteItem() {

    const taskBox = $(this).closest('.task-box');
    const id = taskBox.data().id;

    $.ajax({
        url: '/todo-list/' + id,
        method: 'DELETE'
    })
    .then(fetchTodoItems)
    .catch(
        error => {
            console.log('there was an error deleting from the server', error);
            window.alert('There was a problem deleting this item! Please try again later.');
        }
    )
}