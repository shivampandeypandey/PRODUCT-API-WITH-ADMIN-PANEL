const mongoose = require("mongoose");
const Item = require("../models/item");

exports.items_get_all = (req, res, next) => {
  Item.find()
    .select("name price _id itemImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            itemImage: doc.itemImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/items/" + doc._id
            }
          };
        })
      };
   
      res.status(200).json(response);
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_create_item = (req, res, next) => {
  console.log(req);
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    itemImage: req.file.path
    
  });

  item
    .save()
    .then(result => {
      //console.log(result);

      res.status(201).json({
        message: "Created item successfully",
        createdItem: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/items/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_get_item = (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
    .select("name price _id itemImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          item: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/items"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.items_update_item = (req, res, next) => {
  const id = req.params.itemId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Item.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Item updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/items/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.items_delete = (req, res, next) => {
  const id = req.params.itemId;
  Item.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Item deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/items",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
