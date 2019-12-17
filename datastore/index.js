const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
      //var filePath = path.join(exports.dataDir, file)
      //var filePath = path.join(exports.dataDir, `${id}.txt`)

fs.readdir(`${path.join(__dirname, 'data')}`, (err, files) => {
  if (err) {
    console.log(err)
  }else{
    files.forEach( (file) => {
      var filePath = path.join(exports.dataDir, file)
      fs.readFile(filePath, (err, fileData) => { // Not doing this yet
        var id = file.toString().toString().slice(0,file.toString().toString().length - 4); // using a built in function that does that instead
        items[id]=fileData.toString() // not assigning the way we did it
      });
    });
  }
  // calling a callback here
})


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id)=>{ // did not assign a var id (it's actually never used by us)
    // using the filepath in the bottom of this file
    var filePath = path.join(exports.dataDir, `${id}.txt`)
    fs.writeFile(filePath,text, (err) => {
      if (err){
        console.log(err);
      } else {

        items[id] = text; // line took off
        callback(null, { id, text });
      }
    })
  });

};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {



  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    var filePath = path.join(exports.dataDir, `${id}.txt`)
    fs.writeFile(filePath,text, (err) => {
      if (err) console.log(err);
      items[id] = text;
      callback(null, { id, text });
    })
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    var filePath = path.join(exports.dataDir, `${id}.txt`)
    fs.unlink(filePath, (err) => {
      callback(err);
    })

  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
