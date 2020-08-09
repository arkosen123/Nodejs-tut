const mongoose = require('mongoose');
const schema = mongoose.Schema;

var favouriteSchema=new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
})

let Favourites=mongoose.model('Favourite',favouriteSchema);
module.exports =Favourites;