async function upload(req, res) {
    console.log(req.files);
    res.send('file uploaded');
}

module.exports = {
    upload,
}