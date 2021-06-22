const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8001;

const fs = require('fs');
var db = require("./db.js")
const rootDir = process.cwd();
// app.use(express.static(publicPath));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });
app.use(cors());

app.use("/foto_barang", express.static(rootDir + "/server/uploads"))

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true}));

app.listen(port, () => {
  console.log(`Server jalan pada port ${port}!`);
});


const moment = require('moment')
let photo_file = "foto_barang_" + moment().format('YYYY_MM_DD_HH_mm_ss') + ".png";
let next_path = "/server/uploads/";

app.get("/api/barangs", (req, res, next) => {
  var sql = "select * from barang"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return;
    }
    res.json({
      "message": "sukses menampilkan data",
      "data": rows
    })
  });
});

app.get("/api/barang/:id", (req, res, next) => {
  var sql = "select * from barang where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        "error": err.message
      });
      return;
    }
    res.json({
      "message": "sukses",
      "data": row
    })
  });
});

app.post("/api/barang", (req, res, next) => {
  var data = {
    nama_barang: req.body.nama_barang,
    harga_beli: req.body.harga_beli,
    harga_jual: req.body.harga_jual,
    foto: req.body.foto,
    stok: req.body.stok,
  }

  // Base64 to Img
  let base64Image = req.body.foto.split(";base64,").pop();
  let base64Type = req.body.foto.split(";base64,", 1).pop();

    if (base64Type === "data:image/jpeg" || base64Type === "data:image/jpg" || base64Type === "data:image/png") {
      try {
        fs.writeFile(
          rootDir + next_path + photo_file, base64Image, {
            encoding: "base64"
          },
          function (err) {
            console.log("File created " + photo_file);
          }
        );

        var sql = 'INSERT INTO barang (nama_barang, harga_beli, harga_jual, foto, stok) VALUES( ? , ? , ?, ?, ?)'
        var params = [data.nama_barang, data.harga_beli, data.harga_jual, photo_file, data.stok]

        db.run(sql, params, function (err, result) {
          if (err) {
            res.status(400).json({
              "error": err.message
            })
            return;
          }

          res.status(200).json({
            "message": "sukses menyimpan data",
            "data": data,
          })
        });

      } catch (error) {
        res.status(500).json({
          "message": "gagal menyimpan data",
        })
      }
    } else {
      res.status(500).json({
        "message": "file gambar harus bertipe JPG/JPEG/PNG",
      })
    }
})

app.put("/api/barang/:id", (req, res, next) => {
  var data = {
    nama_barang: req.body.nama_barang,
    harga_beli: req.body.harga_beli,
    harga_jual: req.body.harga_jual,
    foto: req.body.foto_baru,
    stok: req.body.stok,
  }
  // return console.log(req.body);

  if (req.body.foto_baru !== '') {
    fs.unlinkSync(rootDir + next_path + req.body.foto_lama)
    // Base64 to Img
    let base64Image = req.body.foto.split(";base64,").pop();
    let base64Type = req.body.foto.split(";base64,", 1).pop();
  
    if (base64Type === "data:image/jpeg" || base64Type === "data:image/jpg" || base64Type === "data:image/png") {
      try {
  
        fs.writeFile(
          rootDir + next_path + photo_file, base64Image, {
            encoding: "base64"
          },
          function (err) {
            console.log("File created " + photo_file);
          }
        );
  
        db.run(
          `UPDATE barang set 
        nama_barang = coalesce(?,nama_barang), 
        harga_beli = COALESCE(?,harga_beli), 
        harga_jual = coalesce( ? , harga_jual),
        foto = coalesce( ? , foto),
        stok = coalesce( ? , stok)
        WHERE id = ?`,
  
        [data.nama_barang, data.harga_beli, data.harga_jual, photo_file, data.stok, req.params.id],
  
        (err, result) => {
          if (err) {
            res.status(400).json({
              "error": res.message
            })
            return;
          }
          res.json({
            message: "sukses update",
            data: data
          })
        });
      } catch (error) {
        res.status(500).json({
          "message": "gagal menyimpan data",
        })
      }
    } else {
      res.status(500).json({
        "message": "file gambar harus bertipe JPG/JPEG/PNG",
      })
    }

  } else {
    db.run(
      `UPDATE barang set 
        nama_barang = coalesce(?,nama_barang), 
        harga_beli = COALESCE(?,harga_beli), 
        harga_jual = coalesce( ? , harga_jual),
        foto = coalesce( ? , foto),
        stok = coalesce( ? , stok)
        WHERE id = ?`,

      [data.nama_barang, data.harga_beli, data.harga_jual, data.foto_lama, data.stok, req.params.id],

      (err, result) => {
        if (err) {
          res.status(400).json({
            "error": res.message
          })
          return;
        }
        res.json({
          message: "sukses update",
          data: data
        })
      });
  }

})

app.delete("/api/barang/:id", (req, res, next) => {
  db.run(
    'DELETE FROM barang WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({
          "error": res.message
        })
        return;
      }
      res.json({
        "message": "deleted",
        rows: this.changes
      })
    });
})


// Root path
app.get("/", (req, res, next) => {
  res.json({
    "message": "Ok"
  })
});