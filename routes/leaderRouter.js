const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
var authenticate = require('../authenticate');
const cors = require('./cors');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Leaders.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/json');
                res.json(leaders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            Leaders.create(req.body)
                .then((leader) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/json');
                    res.json(leader);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            res.statusCode = 403;
            res.end('PUT operation not supported on /leaders');
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            Leaders.deleteMany({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    });

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Leaders.findOne({ _id: req.params.leaderId })
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            res.statusCode = 403;
            res.end('POST operation not supported on /leaders/' + req.params.leaderId);
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            Leaders.findByIdAndUpdate(req.params.leaderId, {
                $set: req.body
            }, { new: true })
                .then((leader) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            Leaders.findByIdAndRemove(req.params.leaderId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    });

module.exports = leaderRouter;