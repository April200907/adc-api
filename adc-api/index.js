const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ADC API is live!");
});

// Endpoint to serve .js files
app.get("/get/:name", (req, res) => {
    const fileName = req.params.name;
    const path = `${__dirname}/scripts/${fileName}.js`;

    if (!fs.existsSync(path)) {
        return res.status(404).send("File not found");
    }

    res.sendFile(path);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
