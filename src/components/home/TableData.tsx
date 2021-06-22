import { Button, CircularProgress, colors, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, IconButton, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import { grey, pink } from '@material-ui/core/colors';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MUIDataTable from "mui-datatables";
import React from 'react'
import { MdAdd, MdDelete, MdModeEdit } from "react-icons/md";
import ThemeMUI from '../../helpers/theme';
import { useDropzone } from 'react-dropzone';
import { HTTPAddBarang, HTTPReadBarang, HTTPUpdateBarang } from '../../helpers/http';
import { DevImageUrl } from '../../helpers/interceptors';
import { IAddBarang } from '../../helpers/interfaceHttp';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './custom.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    foto_barang: {
      backgroundColor: grey[200],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed grey',
      padding: '10px',
      fontSize: '12px',
      marginTop: '8px'
    },
    foto_preview: {
      width: '100px',
      height: '100%'
    }
  }),
);

interface IPreviews {
  imagePreview: any, imageContent?: any,
  isPublish?: any, eventPublish: any
}

function Previews(props: IPreviews) {
  const classes = useStyles();
  const [filess, setFiles] = React.useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: 'image/jpeg, image/jpg, image/png',
    maxSize: 100000,
    onDrop: (acceptedFiles: any) => {
      acceptedFiles.map((file: any) => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      });

      props.eventPublish(false)

      setFiles(acceptedFiles)
    }
  });

  // ubah ke base64 untuk preview
  filess.map((item: any) => {
    var reader = new FileReader();
    reader.readAsDataURL(item);
    reader.onloadend = function () {
      var base64data = reader.result;
      // console.log(base64data);
      if (props.isPublish === true) {
        props.imagePreview('')
      } else {
        props.imagePreview(base64data)
        props.imageContent(item)
      }
    }
  })

  return (
    <>
      <Typography component="div">
        <div {...getRootProps({ className: classes.foto_barang})}>
          <input {...getInputProps()} />
          <p className="text-gray-300">
            {!isDragActive && 'Klik di sini atau tarik file gambar untuk diunggah!'}
            {isDragActive && !isDragReject && "Type file sesuai!"}
            {isDragReject && "Type file tidak sesuai!"}
          </p>
        </div>
      </Typography>
      <Typography component="div" style={{fontSize: '12px', color: ThemeMUI.palette.grey[900]}}>
        pilih gambar max: 100kb
      </Typography>
    </>
  );
}

const MemoPreviews = React.memo(Previews)

const ModalEdit = (props: { visibleModal: any, closeModal: any, data: any, httpGetdata: any}) => {
  const classes = useStyles()
  const [editedIndex, seteditedIndex] = React.useState(0);
  const [loadingCircular, setLoadingCircular] = React.useState(false);

  const [namaBarang, setnamaBarang] = React.useState('')
  const [hargaBeli, sethargaBeli] = React.useState(0)
  const [hargaJual, sethargaJual] = React.useState(0)
  const [stok, setstok] = React.useState(0)
  const [imageOld, setimageOld]: any = React.useState('')
  const [imagePreview, setimagePreview] = React.useState('')
  const [imageContent, setimageContent] = React.useState('')
  const [isPublish, setisPublish] = React.useState<any>(false)

  function eventImagePreview(image: any) {
    setimagePreview(image)
  }

  function eventImageContent(image: any) {
    setimageContent(image)
  }

  function eventHandlerPublish(data: any) {
    setisPublish(data)
  }

  const httpUpdate = async () => {
    setLoadingCircular(true)

    try {
      const data = {
        id: props.data.id,
        nama_barang: namaBarang,
        harga_beli: hargaBeli,
        harga_jual: hargaJual,
        foto_baru: imagePreview,
        foto_lama: imageOld,
        stok: stok,
      }

      const responseUpdatebarang = await HTTPUpdateBarang(data)
      console.log(responseUpdatebarang)

      props.httpGetdata()

      setTimeout(() => {
        setLoadingCircular(false)
        props.closeModal()
      }, 1000);
    } catch (error) {
      console.log(error)
      setLoadingCircular(false)
      props.closeModal()
    }
  }

  React.useEffect(() => {
    setnamaBarang(props.data.nama_barang)
    sethargaBeli(props.data.harga_beli)
    sethargaJual(props.data.harga_jual)
    setstok(props.data.stok)
    setimageOld(props.data.foto_lama)

    // console.log(props.data)
  }, [props.data])

  return(
    <Modal
      open={props.visibleModal}
      onClose={() => {
        setimageContent('')
        setimagePreview('')
        props.closeModal()
      }}
      center
      closeOnOverlayClick={false}
      closeOnEsc={false}
      classNames={{
        overlay: 'customOverlay'
      }}
    >
      <Typography component="div" style={{ display: 'flex', flexDirection: 'column', marginTop: '40px' }}>
        <TextField
          required
          style={{ marginTop: '20px' }}
          variant="outlined"
          margin="dense"
          id="nama_barang"
          label="Nama Barang"
          name="nama_barang"
          size="small"
          onChange={(e: any) => {
            setnamaBarang(e.target.value)
          }}
          value={namaBarang}
        />

        <TextField
          required
          style={{ marginTop: '20px' }}
          variant="outlined"
          type="number"
          margin="dense"
          id="harga_beli"
          label="Harga Beli"
          name="harga_beli"
          size="small"
          onChange={(e: any) => {
            sethargaBeli(e.target.value)
          }}
          value={hargaBeli}
        />

        <TextField
          required
          style={{ marginTop: '20px' }}
          variant="outlined"
          type="number"
          margin="dense"
          id="harga_jual"
          label="Harga Jual"
          name="harga_jual"
          size="small"
          onChange={(e: any) => {
            sethargaJual(e.target.value)
          }}
          value={hargaJual}
        />

        <TextField
          required
          style={{ marginTop: '20px' }}
          variant="outlined"
          type="number"
          margin="dense"
          id="stok"
          label="Stok"
          name="stok"
          size="small"
          onChange={(e: any) => {
            setstok(e.target.value)
          }}
          value={stok}
        />

        <MemoPreviews imagePreview={eventImagePreview} imageContent={eventImageContent} isPublish={isPublish} eventPublish={eventHandlerPublish} />
        {
          imagePreview !== ''
            ?
            <div className="">
              <img
                className={classes.foto_preview}
                src={imagePreview}
              />
            </div>
            : <div className="" style={{width:'60px'}}>
              <img
                className={classes.foto_preview}
                src={`${DevImageUrl}/${imageOld}`}
              />
            </div>
        }

        <Typography component="div" style={{ marginTop: '10px' }}>
          <Button onClick={props.closeModal} color="secondary" disabled={loadingCircular}>
            Batal
          </Button>
          <Button
            color="primary"
            onClick={() => {
              httpUpdate()
            }}
            disabled={loadingCircular}
          >
            {
              loadingCircular === false ? 'Simpan'
                : <CircularProgress
                  size={20}
                  color="primary"
                />
            }
          </Button>
        </Typography>
      </Typography>
    </Modal>
  )
}

const TableData = () => {

  const classes = useStyles()
  const [visibleModal, setVisibleModal] = React.useState(false)
  const onOpenModalEdit = () => setVisibleModal(true);
  const onCloseModal = () => setVisibleModal(false);

  function eventCloseModal() {
    onCloseModal()
  }

  const [open, setOpen] = React.useState(false);
  const [editedIndex, seteditedIndex] = React.useState(0);
  const [loadingCircular, setLoadingCircular] = React.useState(false);

  const [idbarang, setidbarang] = React.useState(0)
  const [namaBarang, setnamaBarang] = React.useState('')
  const [hargaBeli, sethargaBeli] = React.useState(0)
  const [hargaJual, sethargaJual] = React.useState(0)
  const [stok, setstok] = React.useState(0)
  const [imageOld, setimageOld]: any = React.useState('')
  const [imagePreview, setimagePreview]: any = React.useState('')
  const [imageContent, setimageContent]: any = React.useState('')
  const [isPublish, setisPublish]: any = React.useState<any>(false)

  const columns: any[] = [
    {
      name: "id",
      label: "ID",
    },
    {
      name: "nama_barang",
      label: "Nama Barang",
    },
    {
      name: "harga_beli",
      label: "Harga Beli",
    },
    {
      name: "harga_jual",
      label: "Harga Jual",
    },
    {
      name: "foto",
      label: "Foto",
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return(
            <img src={`${DevImageUrl}/${value}`} style={{width: '80px'}}/>
          )
        }
      }
    },
    {
      name: "stok",
      label: "Stok",
    },
    {
      name: "id",
      label: "Actions",
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <>
              <IconButton aria-label="delete"
                onClick={()=>{
                  datatables.map((item: any) => {
                    if (item.id === value) {
                      editForm(item)
                      onOpenModalEdit();
                    }
                  })
                }}
              >
                <MdModeEdit color="#2196f3"/>
              </IconButton>
              <IconButton aria-label="delete">
                <MdDelete color="#e91e63"/>
              </IconButton>
            </>
          )
        }
      }
    },
  ];

  const [datatables, setdatatables] = React.useState([]);
  let dataTable: any[] = datatables;

  function eventImagePreview(image: any) {
    setimagePreview(image)
  }

  function eventImageContent(image: any) {
    setimageContent(image)
  }

  function eventHandlerPublish(data: any) {
    setisPublish(data)
  }

  const openModal = () => {
    setOpen(true);
  };

  const clearForm = () => {
    setnamaBarang('')
    sethargaBeli(0)
    sethargaJual(0)
    setstok(0)
    setimagePreview('')
    setimageContent('')
    setOpen(false);
  }

  const editForm = (params: IAddBarang) => {
    setidbarang(params.id)
    setnamaBarang(params.nama_barang)
    sethargaBeli(params.harga_beli)
    sethargaJual(params.harga_jual)
    setstok(params.stok)
    setimageOld(params.foto)
    setimagePreview('')
  }

  const closeModal = () => {
    clearForm()
    setOpen(false);
  };

  const httpReadBarang = async () => {
    try {
      const responeReadbarang = await HTTPReadBarang();
      setdatatables(responeReadbarang.data.data)
      console.log('get data: ',responeReadbarang.data.data)
      
    } catch (error) {
      console.log(error)
    }
  }

  const httpPost = async () => {
    setLoadingCircular(true)

    try {
      const data = {
        nama_barang: namaBarang,
        harga_beli: hargaBeli,
        harga_jual: hargaJual,
        foto: imagePreview,
        stok: stok,
      }

      const responseAddbarang = await HTTPAddBarang(data)
      console.log(responseAddbarang)

      httpReadBarang()

      setTimeout(() => {
        setLoadingCircular(false)
        closeModal()
      }, 1000);
    } catch (error) {
      console.log(error)
      setLoadingCircular(false)
    }
  }

  

  // Lifecycle

  React.useEffect(() => {
    httpReadBarang()
  }, [])

  React.useEffect(() => {
    // console.log(datatables)
  }, [datatables])
  
  return (
    <Typography component="div" style={{marginTop: '60px', marginLeft:'10px', marginRight: '10px'}}>
      
      <ModalEdit 
        visibleModal={visibleModal} 
        closeModal={eventCloseModal} 
        data={{
          id: idbarang,
          nama_barang: namaBarang,
          harga_beli: hargaBeli,
          harga_jual: hargaJual,
          stok: stok,
          foto_lama: imageOld,
          foto_baru: imagePreview
        }}
        httpGetdata={httpReadBarang}
      />

      <Button
        style={{backgroundColor: ThemeMUI.palette.secondary.main, color: '#fff', marginBottom: '10px'}}
        variant="contained"
        onClick={() => {
          openModal()
        }}
      >
        Tambah Barang
        <MdAdd />
      </Button>
      
      <Dialog open={open} onClose={closeModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {editedIndex === 0 ? 'Tambah Data' : 'Edit Data'}
        </DialogTitle>
        
        <DialogContent>
          <Typography component="div" style={{display: 'flex', flexDirection: 'column'}}>
            <TextField
              required
              style={{marginTop: '20px'}}
              variant="outlined"
              margin="dense"
              id="nama_barang"
              label="Nama Barang"
              name="nama_barang"
              size="small"
              onChange={(e: any) => {
                setnamaBarang(e.target.value)
              }}
              value={namaBarang}
            />

            <TextField
              required
              style={{marginTop: '20px'}}
              variant="outlined"
              type="number"
              margin="dense"
              id="harga_beli"
              label="Harga Beli"
              name="harga_beli"
              size="small"
              onChange={(e: any) => {
                sethargaBeli(e.target.value)
              }}
              value={hargaBeli}
            />

            <TextField
              required
              style={{marginTop: '20px'}}
              variant="outlined"
              type="number"
              margin="dense"
              id="harga_jual"
              label="Harga Jual"
              name="harga_jual"
              size="small"
              onChange={(e: any) => {
                sethargaJual(e.target.value)
              }}
              value={hargaJual}
            />

            <TextField
              required
              style={{marginTop: '20px'}}
              variant="outlined"
              type="number"
              margin="dense"
              id="stok"
              label="Stok"
              name="stok"
              size="small"
              onChange={(e: any) => {
                setstok(e.target.value)
              }}
              value={stok}
            />

            <MemoPreviews imagePreview={eventImagePreview} imageContent={eventImageContent} isPublish={isPublish} eventPublish={eventHandlerPublish} />
            {
              imagePreview !== ''
                ?
                <div className="">
                  <img
                    className={classes.foto_preview}
                    src={imagePreview}
                  />
                </div>
                : <div className="mb-5"></div>
            }

            <Typography component="div" style={{ marginTop: '10px' }}>
              <Button onClick={closeModal} color="secondary" disabled={loadingCircular}>
                Batal
              </Button>
              <Button 
                color="primary"
                onClick={()=>{
                  httpPost()
                }}  
                disabled={loadingCircular}
              >
                {
                  loadingCircular === false ? 'Simpan'
                    : <CircularProgress
                      size={20}
                      color="primary"
                    />
                }
              </Button>
            </Typography>
          </Typography>
        </DialogContent>
      </Dialog>
        
      <MUIDataTable
        title={"List Data Barang"}
        data={dataTable}
        columns={columns}
        options={{
          selectableRows: 'none',
          filter: 'false',
          viewColumns: 'false',
          print: 'false',
          download: 'false',
          sort: false
        }}
      />
    </Typography>
  )
}

export default TableData
