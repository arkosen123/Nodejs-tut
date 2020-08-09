const mongoose = require('mongoose');
const schema = mongoose.Schema;

let leaderSchema = new schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            default: false
        },
        abbr: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true      
        }
    }, {
    timestamps: true
});

let Leaders=mongoose.model('Leader',leaderSchema);
module.exports =Leaders;
