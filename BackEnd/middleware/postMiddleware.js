
// Check validation of login
const postValidation = (req, res, next) => {
    try {
        const { title , description} = req.body;
        if (title == "" || description == "") {
            res.status(400).json({ message: 'All fields are required' })
        }
        else next()
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {postValidation}