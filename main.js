const express = require('express');
const app = express();

app.get('', async(req, res, next) => {
    return res.send('<h2>Hello Header Updated</h2>');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
