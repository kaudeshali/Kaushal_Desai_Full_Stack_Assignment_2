const express = require('express');
require("dotenv").config()


const app = express();
app.use(express.static('public'));

//This will logs the message "EMS Application Will start at:" followed by the value of the UI_PORT environment variable to the console.
app.listen(process.env.UI_PORT, () => {
    console.log(`EMS Application Will start at: ` + process.env.UI_PORT);
});