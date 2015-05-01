var sqlite3 = require('sqlite3').verbose();
var Q = require('q');
var FS = require('q-io/fs');
var glob = require('glob');

// the table map that will contain the resulting tables
var tableMap = {};

var dbPath = './db/multiwordnet-simple.db3';

var db;
var dbAll;
var dbExec;
var qGlob = Q.denodeify(glob);

var maybeAdd = function (str) {
  if (str) {
    return '\t' + str;
  }
  return '';
};

var makeTable = function (tableName) {
  console.log('starting work for ' + tableName);
  tableMap[tableName] = '';
  var deferred = Q.defer();
  db.each('SELECT lemma, id_n, id_v, id_a, id_r FROM ' + tableName + ';',
    function (err, row) {
      if (err) {
        deferred.reject(new Error(err));
      }
      var rowString = '';
      rowString += row.lemma.replace(/_/g, ' ');
      rowString += maybeAdd(row.id_n);
      rowString += maybeAdd(row.id_v);
      rowString += maybeAdd(row.id_a);
      rowString += maybeAdd(row.id_r);
      tableMap[tableName] += rowString + '\n';
    },
    function () {
      deferred.resolve(tableMap[tableName]);
    });
  return deferred.promise;
};

var makeDbMaybe = function () {
  // glob all building files
  return qGlob('./src/*.sql')
    // read every file
    .then(function (files) {
      var promises = [];
      for (var f in files) {
        promises.push(FS.read(files[f]));
      }
      return Q.all(promises);
    })
    // execute every query in each file
    .then(function (queries) {
      var promises = [];
      for (var q in queries) {
        console.log('Executing query %d...', q + 1);
        promises.push(dbExec(queries[q]));
      }
      return Q.all(promises);
    })
    .then(function () {
      console.log('All queries were succesfully executed.');
      return true;
    });
};

return FS.exists(dbPath)
  // if the DB doesn't exist, make it
  .then(function (existsDb) {
    db = new sqlite3.Database(dbPath);
    dbAll = Q.nbind(db.all, db);
    dbExec = Q.nbind(db.exec, db);
    if (existsDb) {
      return true;
    }
    return makeDbMaybe();
  })
  // read all the built tables' names
  .then(function () {
    return dbAll('SELECT name FROM sqlite_master WHERE type=\'table\';');
  })
  // for each table, build the map
  .then(function (tables) {
    var promises = [];
    for (var t in tables) {
      promises.push(makeTable(tables[t].name));
    }
    return Q.all(promises);
  })
  // check if the out dir exists
  .then(function () {
    return FS.isDirectory('./out/');
  })
  // remove the out dir
  .then(function (hasOutDir) {
    if (hasOutDir) {
      return FS.removeTree('./out/');
    }
    return true;
  })
  // make the out dir
  .then(function () {
    return FS.makeDirectory('./out/');
  })
  // write the index files
  .then(function () {
    var promises = [];
    for (var t in tableMap) {
      promises.push(FS.append('./out/' + t, tableMap[t], {encoding: 'UTF-8'}));
    }
    return Q.all(promises);
  })
  // GTFO
  .done(function () {
    console.log('yolo');
    db.close();
  });