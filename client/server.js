const express = require('express');
var history = require('connect-history-api-fallback');

const app = express();

app.use(express.static(__dirname + '/dist'));
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(express.static(__dirname + '/dist'));
 
 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});