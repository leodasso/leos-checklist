$(document).ready(onReady);

// setup date formatter
var dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };

function onReady() {
    console.log('hello');
    
    fetchTodoItems();
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
            <input type="text" placeholder "new To-Do">
            <button class="new-button">Add</button>
        </div>`;

    container.append(newItemHtml);
}