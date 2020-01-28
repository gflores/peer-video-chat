const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));
 
 
const port = process.env.PORT || 3015;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});