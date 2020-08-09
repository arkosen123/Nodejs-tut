const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
var authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Promotions.find({})
            .then((promos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/json');
                res.json(promos);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (cors.corsWithOptions, authenticate.verifyAdmin({ _id: req.user._id })) {
            Promotions.create(req.body)
                .then((promo) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/json');
                    res.json(promo);
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
            res.end('PUT operation not supported on /promotions');
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            Promotions.deleteMany({})
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

promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Promotions.findOne({ _id: req.params.promoId })
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            res.statusCode = 403;
            res.end('POST operation not supported on /promotions/' + req.params.promoId);
        }
        else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end("You are not authorized to perform this operation!");
        }
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (authenticate.verifyAdmin({ _id: req.user._id })) {
            Promotions.findByIdAndUpdate(req.params.promoId, {
                $set: req.body
            }, { new: true })
                .then((promo) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promo);
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
            Promotions.findByIdAndRemove(req.params.promoId)
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

module.exports = promoRouter;