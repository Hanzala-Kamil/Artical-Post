const validateSignup = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Invalid or missing 'name'" });
    }
    else if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Invalid or missing 'email'" });
    }
    else if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: "Invalid or missing 'password'" });
    }
    else{
        next();
    }
};


// Check validation of OPt
const optValidation = (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (email == "" || otp == "") {
            res.status(400).json({ message: 'All fields are required' })
        }
        else next()
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// Check validation of login
const loginValidation = (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email == "" || password == "") {
            res.status(400).json({ message: 'All fields are required' })
        }
        else next()
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { validateSignup , optValidation ,loginValidation };
