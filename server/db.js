var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "./server/db.sqlite"

let db = new sqlite3.Database(DBSOURCE);
// db.run('CREATE TABLE barang (id INTEGER PRIMARY KEY AUTOINCREMENT, nama_barang text UNIQUE, harga_beli text, harga_jual text, foto text, stok text)')

// db.close();

module.exports = db
