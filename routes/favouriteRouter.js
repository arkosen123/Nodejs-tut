const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
var Users = require('../models/users');
var Favourites = require('../models/favourites');
var authenticate = require('../authenticate');
const cors = require('./cors');
var ObjectId = require('mongodb').ObjectId;

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let o_id = new ObjectId(req.user._id);
        Favourites.findOne({ user: o_id })
            .populate('user dishes')
            .then((favourite) => {
                if (favourite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/text');
                    res.end('null');
                }
            });
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let o_id = new ObjectId(req.user._id);
        Favourites.findOne({ user: o_id })
            .then((favourite) => {
                if (favourite) {
                    req.body.forEach((reqId) => {
                        if (favourite.dishes.indexOf(reqId) === -1) {
                            favourite.dishes.push(reqId);
                            favourite.save();
                        }
                    });
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }
                else {
                    Favourites.create({ "user": req.user._id })
                        .then((favourite) => {
                            req.body.forEach((reqId) => {
                                favourite.dishes.push(reqId);
                                favourite.save();
                            });
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        });
                }
            });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/text');
        res.json('PUT operation not supported on /favourites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let o_id = new ObjectId(req.user._id);
        Favourites.findOne({ user: o_id })
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
                Favourites.deleteOne({ user: o_id })
                    .then((favourite) => {
                        favourite.save();
                    })
            })
    });

favouriteRouter.route('/:favouriteId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let o_id = new ObjectId(req.user._id);
        Favourites.findOne({ user: o_id })
            .then((favourite) => {
                if (favourite) {
                    let copy = false;
                    favourite.dishes.forEach((item) => {
                        if (item.equals(req.params.favouriteId)) {
                            res.statusCode = 403;
                            res.setHeader('Content-Type', 'application/text');
                            res.end('This dish already exist in your favourite list!');
                            copy = true;
                        }
                    });
                    if (copy === false) {
                        favourite.dishes.push(req.params.favouriteId);
                        favourite.save()
                            .then((favourite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourite);
                            });
                    };
                }
                else {
                    Favourites.create({ "user": req.user._id })
                        .then((favourite) => {
                            favourite.dishes.push(req.params.favouriteId);
                            favourite.save()
                                .then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favourite);
                                });
                        });
                }
            })
            .catch((err) => { next(err); });
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let o_id = new ObjectId(req.user._id);
        Favourites.findOne({ user: o_id })
            .then((favourite) => {
                if (favourite) {
                    if (favourite.dishes.indexOf(req.params.favouriteId) === -1) {
                        res.statusCode = 404;
                        res.setHeader('Content-type', 'application/text');
                        res.end(`This dishId does'nt not exist!`);
                    };
                    favourite.dishes.forEach((item) => {
                        if (item.equals(req.params.favouriteId)) {
                            favourite.dishes.remove(item);
                            favourite.save()
                                .then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favourite);
                                });
                        }
                    });
                }
                else {
                    res.statusCode = 404;
                    res.setHeader('Content-type', 'application/text');
                    res.end('You have no favourite item listed!');
                }
            })
            .catch((err) => { next(err); });
    })

module.exports = favouriteRouter;