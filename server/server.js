const express = require('express');
const app = express();
const PORT = 5000;

// Have the express app listen on our port
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
    
})

app.use(express.static('server/public'));