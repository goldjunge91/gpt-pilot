const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    validate: async (username, password) => {
        // Fetch user and hashedPasswordFromDb from DB based on username
        // For example, let's assume we have a function getUserByUsername that does this
        const user = await getUserByUsername(username); // This function needs to be implemented according to your DB logic
        if (!user) {
            throw new Error('User not found');
        }

        // Compare provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.hashedPasswordFromDb);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
    },

    generateToken: (username) => {
        // Create JWT
        return jwt.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY // Configured in env
        });
    }
}
