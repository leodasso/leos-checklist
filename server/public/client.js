$(document).ready(onReady);

// setup date formatter
var dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };

function onReady() {

    // fetch the todo list from the server so it can be populated
    // when the page loads.
    fetchTodoItems();

    // create a listener for the 'new item' button
    $('#checklist-container').on('click', '.new-button', sendNewTodo);
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

        const html = 
            `<div class="task-box" data-id="${element.id}">
                <button>Complete</button>
                <div>${formattedDate}</div>
                <input type="text" value="${element.descr}">
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