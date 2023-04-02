
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

router.get('/', validateAccessToken, (req, res) => {
    res.status(200).send('User data')
})

router.post('/new-user', async (req, res) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        const user = {
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        }
        User.create(user)
            .then((doc) => res.status(201).send(doc))
            .catch((err) => res.status(500).send(err.message))
    } catch (err) {
        res.status(400).send(err.message)
    }
})

router.post('/login', checkUserExist, async (req, res) => {
    try {
        let user = req.user;
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateToken(req.user);
            const refreshToken = generateToken(req.user, true);
            user.access_token = accessToken;
            user.refresh_token = refreshToken;
            user.save()
                .then((doc) => res.status(200).send(doc))
                .catch((err) => res.status(500).send(err.message))
        } else {
            res.status(400).send('Wrong password')
        }
    } catch (err) {
        res.status(500).send('Error')
    }
})

router.post('/refresh', checkUserExist, async (req, res) => {
    const refreshToken = req.body.refresh_token;
    if (refreshToken == null) return res.status(400).send('Cannot find user');
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.send('Refresh token expired again');
            // let user = req.user;
            req.user.access_token = generateToken(user);
            req.user.save()
                .then((doc) => res.status(200).send(doc))
                .catch((err) => res.status(500).send(err.message))
        })
    } catch (err) {
        res.status(500).send('Error')
    }
})

router.post('/logout', checkUserExist, async (req, res) => {
    try {
        let user = req.user;
        user.access_token = "";
        user.refresh_token = "";
        user.save()
            .then((doc) => res.status(200).send(doc))
            .catch((err) => res.status(500).send(err.message))

    } catch (err) {
        res.status(500).send('Error')
    }
})

function generateToken(user, isRefreshToken = false) {
    const payload = { name: user.name, password: user.password, _id: user.id };
    if (isRefreshToken) return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
}

async function checkUserExist(req, res, next) {
    const user = await User.findOne({ username: req.body.username });
    req.user = user;
    if (user == null) return res.status(400).send('Cannot find user');
    next();
}

function validateAccessToken(req, res, next) {
    const authData = req.headers['authorization'];
    const token = authData && authData.split(' ')[1];
    if (token == null) res.status(401).send('Unauthorized');
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token invalid');
        req.user = user;
        next();
    })
}

function hashPassword(password) {
    return bcrypt.hash(password, 10)
}

module.exports = { authRoute: router };