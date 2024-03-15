// POST /login
router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('isMatch true user password:', isMatch);

        if (isMatch) {
            // Validate input
            if (!username || !password) {
                return res
                    .status(400)
                    .json({ error: "Username and password are required" });
            }

            // Check if username and password match a user in the database
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ error: "Invalid username or password" });
            }

            // Compare password to hashed password in database
            const isMatch = await bcrypt.compare(password, user.password);

            // If password matches, set session userId to logged in user's id
            if (isMatch) {
                req.session.userId = user.id;
            } else {
                return res.status(400).json({ error: "Invalid username or password" });
            }

            // Create a JSON Web Token
            const token = jwt.sign({
                username: user.username
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.cookie('token', token, { httpOnly: true });

            res.redirect('/');
        } else {
            res.status(400).json({ error: 'Password is incorrect' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error during login' });
    }
});