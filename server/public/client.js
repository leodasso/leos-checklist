$(document).ready(onReady);
let placeholderArray = [];

// setup date formatter
const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };

function onReady() {

    getPlaceholders();

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
    //  hover / un-hover
    $('#checklist-container').on('mouseenter', '.toggle-button', mouseEnterTodoItem);
    $('#checklist-container').on('mouseleave', '.toggle-button', mouseLeaveTodoItem);
    // mousedown / mouseup
    $('#checklist-container').on('mousedown', '.toggle-button', mouseDownTodoItem);
    $('#checklist-container').on('mouseup', '.toggle-button', mouseUpTodoItem);

    // toggle sorting buttons
    $('#sort-complete-button').on('click', sortByCompleted);
    $('#sort-default-button').on('click', sortByDefault);


}

function mouseEnterTodoItem() {
    
    this.classList.add('hover');
}

function mouseLeaveTodoItem() {
    
    this.classList.remove('hover');
}

function mouseDownTodoItem() {

    this.classList.add('active');
    this.classList.remove('hover');
}

function mouseUpTodoItem() {

    this.classList.remove('active');
}

// The database has a list of placeholders that we can show in the 
// input field for creating new tasks. get them here
function getPlaceholders() {

    $.ajax({
        url: '/placeholders',
        type: 'GET'
    })
    .then(
        result => {
            placeholderArray = result;
        }
    ).catch(
        error => {
            // TODO tell user there was an error
            console.log('error communicating with server', error);
        }
    );
}

// Toggles the 'complete' status of the item. If it's complete, uncompletes,
// and if it's not complete, completes it. 
function toggleTodoItem() {

    // find the taskbox which is the parent of this button. It contains the data
    const taskBox = $(this).closest('.task-box');

    const isComplete    = taskBox.data().complete;
    const id            = taskBox.data().id;

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

function sortByCompleted() {
    sendSorting('completed');
}

function sortByDefault() {
    sendSorting('default');
}

function sendSorting(sortingType) {

    $.ajax({
        type: 'PUT',
        url: '/sorting',
        data: {sorting: sortingType}
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
            `<div class="${classes} toggle-button" data-id="${element.id}" data-complete="${element.complete}">
                <div class="task-date">${formattedDate}</div>
                <div class="task-box-mainline">
                    <p>${element.descr}</p>
                    <button class="delete-button">X</button>
                </div>
            </div>`;

        container.append(html);
    }

    // append the 'new todo' element after all the others
    container.append(getInputHtml());
}

// returns string that contains the HTML of the input section
function getInputHtml() {

    let placeholder = 'Create a new to-do';

    // it's not guaranteed that the server has responded with this array yet
    if (placeholderArray.length > 0) {

        // choose a random placeholder
        const randIndex = Math.floor(Math.random() * placeholderArray.length);
        placeholder = placeholderArray[randIndex].text;
    }

    return `<div class="new-task">
            <input type="text" id="new-input" placeholder="${placeholder}">
            <button class="new-button">Add</button>
        </div>`;
}



function deleteItem() {

    const taskBox = $(this).closest('.task-box');
    const id = taskBox.data().id;

    // confirm deletion
    let confirmation = window.confirm('Are you sure you want to delete this task?');
    if (!confirmation) return;

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