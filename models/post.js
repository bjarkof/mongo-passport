var mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
    id: String,
    title: String,
    body: String,
    author: {
        name: String,
        id: String,    
    },
    createdAt: Date,
})