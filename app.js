require("dotenv").config();
let express = require('express');
let app = express();
const sequelize = require('./db');

let journal = require('./controllers/journalcontroller');
let User = require('./controllers/usercontroller');
// let calc = require('./controllers/calculatorcontroller');

sequelize.sync();

app.use(require('./middleware/headers')); //activating the headers in the app.js -- headers must come before the routes are declared
// app.use("/test", function(req, res){
//     res.send("This is a message from the test endpoint on the server!");
// });

app.use(express.json());

app.use('/user', User);

app.use('/journal', journal);


// app.use('/calculator', calc)

app.listen(3000, function(){
    console.log('App is listening on port 3000');
});

// app.use('/about', journal);


// localhost:3000

// localhost:3000/test