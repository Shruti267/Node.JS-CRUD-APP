const mongoose = require('mongoose');
const express = require('express');
const Tile = require('./models/tile');
const bodyParser = require('body-parser');


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const app = express();

app.use(bodyParser.json());

// let express to use this
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.get('/api/tiles', (req, res) => {
    Tile.find().then(tiles => {
        return res.status(200).json({message:' Fetched tiles successfully', tiles: tiles});
    }).catch( err => {
        if(!err.statusCode)
        {
            err.statusCode = 500;
        }
    })
});


app.post('/api/tiles', (req, res) => {

    console.log("in post api");

    if (!req.body.tile || !req.body.tile.content || !req.body.tile.content.contentType || !req.body.tile.content.contentDescription) {
        return res.status(400).json({message: "Invalid data"});
    }


    if (!(req.body.tile.width === "narrow" || req.body.tile.width === "normal" || req.body.tile.width === "wide")) {
        return res.status(400).json({message: "Invalid width value"});
    }

    if (!(req.body.tile.content.contentType === "audio" || req.body.tile.content.contentType === "video" || req.body.tile.content.contentType === "image" || req.body.tile.content.contentType === "html")) {
        return res.status(400).json({message: "Invalid contentType"});
    }

    if (!req.body.tile.tags || !Array.isArray(req.body.tile.tags)) {
        return res.status(400).json({message: "Invalid tags"});
    }

    const title = req.body.tile.title;
    const description = req.body.tile.description;
    const tags = req.body.tile.tags;
    const width = req.body.tile.width;
    const contentLink = req.body.tile.content.contentLink;
    const contentType = req.body.tile.content.contentType;
    const contentDescription = req.body.tile.content.contentDescription;

    const tile = new Tile({
        title: title, 
        description: description,
        tags: tags,
        width: width,
        content: {
            contentLink: contentLink,
            contentType: contentType,
            contentDescription: contentDescription
        }
    });

    tile.markModified('tags');
    tile.save().then(result => {
        console.log(result);
        return res.status(201).json({
            message: 'tile created successfully!',
            tile: result
        })
    }).catch(err => {
        if(!err.statusCode)
        {
            err.statusCode = 500;
        }

        return res.status(400).json({message: "Some error occured"});
    });
});

app.put('/api/tiles/:tileId', (req, res) => {

    console.log("in put");

    if (!req.params.tileId) {
        return res.status(400).json({message: "Invalid tile Id"});
    }

    if (!req.body.tile || !req.body.tile.content || !req.body.tile.content.contentType || !req.body.tile.content.contentDescription) {
        return res.status(400).json({message: "Invalid data"});
    }


    if (!(req.body.tile.width === "narrow" || req.body.tile.width === "normal" || req.body.tile.width === "wide")) {
        return res.status(400).json({message: "Invalid width value"});
    }

    if (!(req.body.tile.content.contentType === "audio" || req.body.tile.content.contentType === "video" || req.body.tile.content.contentType === "image" || req.body.tile.content.contentType === "html")) {
        return res.status(400).json({message: "Invalid contentType"});
    }

    if (!req.body.tile.tags || !Array.isArray(req.body.tile.tags)) {
        return res.status(400).json({message: "Invalid tags"});
    }

    const tileId = req.params.tileId;

    const title = req.body.tile.title;
    const description = req.body.tile.description;
    const tags = req.body.tile.tags;
    const width = req.body.tile.width;
    const content = req.body.tile.content;

    console.log("tile ", tile);
    tile.markModified('tags');
    // Tile.updateOne({ _id: tileId }, { $set: tile }).then(result => {
    Tile.updateOne({ _id: tileId }, { $set: {
        "title": title, 
        "description": description,
        "tags": tags,
        "width": width,
        "content": content
    } }).then(result => {
        console.log(result);
        return res.status(201).json({
            message: 'tile updated successfully!',
            tile: result
        })
    }).catch(err => {
        if(!err.statusCode)
        {
            err.statusCode = 500;
        }
    });
});

app.delete('/api/tiles/:tileId', (req, res) => {

    if (!req.params.tileId) {
        return res.status(400).json({message: "Invalid tile Id"});
    }

    const tileId = req.params.tileId;

    Tile.deleteOne({ _id: tileId }).then(result => {
        console.log(result);
        return res.status(201).json({
            message: 'tile deleted successfully!',
            tile: result
        })
    }).catch(err => {
        if(!err.statusCode)
        {
            err.statusCode = 500;
        }
    });
});

mongoose.connect('mongodb+srv://shruti:password%40123@cluster0.shwit.mongodb.net/myDatabase?retryWrites=true&w=majority')
.then(result => {
    app.listen(3080, function() {
        console.log('listening on 3080')
    })
}).catch(err => {
    console.log(err);
});