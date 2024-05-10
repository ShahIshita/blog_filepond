const express = require('express');
// const busboy = require('connect-busboy');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const app = express();

// Define CORS options
app.use(cors());

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join( __dirname, "/uploads"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
}); // Make sure that the upload path exists

app.post('/uploads', upload.single('file'), (req, res) => {
    return res.json(
        {
            message:"uploaded"
        }
    )
})
// Start the server
const server = app.listen(3000, function () {
    console.log(`Listening on port ${server.address().port}`);
});


