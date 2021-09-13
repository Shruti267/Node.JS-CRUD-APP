const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tileSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        tags: { 
            type : Array , 
            "default" : [] 
        },
        width: {
            type: String,
            enum: ['narrow', 'normal', 'wide'],
            required: true
        },
        content: {
            contentLink: {
                type: String,
                required: true
            },
            contentType: {
                type: String,
                enum: ['audio', 'video', 'image', 'html'],
                required: true
            },
            contentDescription: {
                type: String,
                required: true
            }
        }
    }, 
    {timestamps: true}
);

module.exports = mongoose.model('Tile', tileSchema);