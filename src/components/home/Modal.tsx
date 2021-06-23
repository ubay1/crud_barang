import React from 'react'
import { IModalEdit } from '../../helpers/interfaceHttp';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './custom.css'
import { makeStyles, Theme, createStyles, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { HTTPAddBarang, HTTPDeleteBarang, HTTPUpdateBarang } from '../../helpers/http';
import { DevImageUrl } from '../../helpers/interceptors';
import { useDropzone } from 'react-dropzone';
import ThemeMUI from '../../helpers/theme';

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
      marginTop: '0px'
    },
    foto_preview: {
      width: '100px',
      height: '100%'
    }
  }),
);

interface IPreviews {
  imagePreview?: any, imageContent?: any,
  isPublish?: any, eventPublish?: any
}

function PreviewsFoto(props: IPreviews) {
  const classes = useStyles();
  const [filess, setFiles] = React.useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, fileRejections } = useDropzone({
    accept: 'image/jpeg,image/png',
    maxSize: 100000,
    onDrop: (acceptedFiles: any) => {
      acceptedFiles.map((file: any) => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      });

      props.eventPublish(false)

      setFiles(acceptedFiles)
    },
    onDropRejected(reject: any) {
    }
  });
  
  const fileRejectionItems = fileRejections.map(({ file, errors }: any) => (
    <div style={{marginBottom: '30px'}}>  
      {errors.map((e: any) => (
          <span style={{color: 'red', fontSize: '14px'}} key={e.code}>{e.message}</span>
        ))}
    </div>
  ));

  // ubah ke base64 untuk preview
  filess.map((item: any) => {
    var reader = new FileReader();
    reader.readAsDataURL(item);
    reader.onloadend = function () {
      var base64data = reader.result;
      // console.log(base64data);
      if (props.isPublish === true) {
        props.imagePreview('')
        console.log('kena disini ispublish true')
      } else {
        props.imagePreview(base64data)
        props.imageContent(item)
        console.log('kena disini ispublish false')
      }
    }
  })

  return (
    <>
      <Typography component="div">
        <Typography component="div" style={{ fontSize: '12px', marginTop: '10px', color: ThemeMUI.palette.grey[900] }}>
          pilih gambar max: 100kb
        </Typography>
        <div {...getRootProps({ className: classes.foto_barang })}>
          <input {...getInputProps()} />
          <p className="text-gray-300">
            {!isDragActive && 'Klik di sini atau tarik file gambar untuk diunggah!'}
            {isDragAccept && 'Type file sesuai'}
            {isDragReject && "Type file tidak sesuai!"}
          </p>
        </div>
        {fileRejectionItems}
      </Typography>
    </>
  );
}

const MemoPreviews = React.memo(PreviewsFoto)

const CompModal = (props: IModalEdit) => {
    const classes = useStyles()

    /* -------------------------------------------------------------------------- */
    /*                                  usestate                                  */
    /* -------------------------------------------------------------------------- */
    const [typeModal, settypeModal] = React.useState<any>('')
    const [loadingCircular, setLoadingCircular] = React.useState(false);
    
    const [visibleModalss, setvisibleModalss] = React.useState(false)
    const [idBarang, setidBarang] = React.useState(0)
    const [namaBarang, setnamaBarang] = React.useState('')
    const [hargaBeli, sethargaBeli] = React.useState('')
    const [hargaJual, sethargaJual] = React.useState('')
    const [stok, setstok] = React.useState('')
    const [imageOld, setimageOld]: any = React.useState('')
    const [imagePreview, setimagePreview] = React.useState('')
    const [imageContent, setimageContent] = React.useState('')
    const [isPublishEdit, setisPublishEdit] = React.useState<any>(false)
    /* -------------------------------------------------------------------------- */
    /*                                  end usestate                              */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                  function                                  */
    /* -------------------------------------------------------------------------- */
    function eventImagePreview(image: any) {
      setimagePreview(image)
    }

    function eventImageContent(image: any) {
      setimageContent(image)
    }

    function eventHandlerPublish(data: any) {
      setisPublishEdit(data)
    }

    function clearForm() {
      settypeModal('')
      setnamaBarang('')
      sethargaBeli('')
      sethargaJual('')
      setstok('')
      setimagePreview('')
      setimageContent('')
      setvisibleModalss(false);
      props.closeModal()
    }

    function handleInputnominal(text: any) {
      if (/^\d+$/.test(text) || text === '') {
        return text;
      }
    }
    /* -------------------------------------------------------------------------- */
    /*                                end function                                */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------------------------------------------------- */
    /*                                HTTP Request                                */
    /* -------------------------------------------------------------------------- */
    const httpUpdate = async () => {
      setLoadingCircular(true)

      try {
        const data = {
          id: idBarang,
          nama_barang: namaBarang,
          harga_beli: hargaBeli,
          harga_jual: hargaJual,
          foto_baru: imagePreview,
          foto_lama: imageOld,
          stok: stok,
        }

        if (namaBarang === '' || hargaBeli === '' || hargaJual === '' || stok === '') {
          setLoadingCircular(false)
          alert('harap isi form yang telah disediakan')
        } else {
          const responseUpdatebarang = await HTTPUpdateBarang(data)
          console.log(responseUpdatebarang)
  
          setTimeout(() => {
            setisPublishEdit(true)
            clearForm()
            setLoadingCircular(false)
          }, 1000);
  
          throw data;
        }

      } catch (error) {
        console.log(error)
        if (error.status === 500) {
          alert(error.data.message)
        } else {
          clearForm()
        }
        setLoadingCircular(false)
        // props.closeModal()
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
        // console.log('test = ',data)

        if ( namaBarang === '' || hargaBeli === '' ||  hargaJual === '' || imagePreview === '' ||  stok === '' ){
          setLoadingCircular(false)
          alert('harap isi form yang telah disediakan')
        } else {
          const responseAddbarang = await HTTPAddBarang(data)
          console.log(responseAddbarang)
  
          setTimeout(() => {
            setisPublishEdit(true)
            clearForm()
            setLoadingCircular(false)
          }, 1000);
        }


      } catch (error) {
        console.log(error)
        clearForm()
        setLoadingCircular(false)
      }
    }

    const httpDelete = async () => {
      setLoadingCircular(true)

      try {
        const responseDeletebarang = await HTTPDeleteBarang({ id: idBarang })
        console.log(responseDeletebarang)

        setTimeout(() => {
          setisPublishEdit(true)
          setLoadingCircular(false)
          clearForm()
        }, 1000);
      } catch (error) {
        console.log(error)
        setLoadingCircular(false)
        clearForm()
      }
    }
    /* -------------------------------------------------------------------------- */
    /*                              End HTTP Request                              */
    /* -------------------------------------------------------------------------- */

    const DynamicForm = [
      { onChange: setnamaBarang, value: namaBarang, label: 'Nama Barang', name: 'nama_barang' },
      { onChange: sethargaBeli, value: hargaBeli, label: 'Harga Beli', name: 'harga_beli' },
      { onChange: sethargaJual, value: hargaJual, label: 'Harga Jual', name: 'harga_jual' },
      { onChange: setstok, value: stok, label: 'Stok', name: 'stok' },
    ]

    /* -------------------------------------------------------------------------- */
    /*                                  lifecycle                                 */
    /* -------------------------------------------------------------------------- */
    React.useEffect(() => {
      settypeModal(props.typeModal)
      setvisibleModalss(props.visibleModal)
      setidBarang(props.data.id)
      setnamaBarang(props.data.nama_barang)
      sethargaBeli(props.data.harga_beli)
      sethargaJual(props.data.harga_jual)
      setstok(props.data.stok)
      setimageOld(props.data.foto)
      console.log(props)
    }, [props])
    /* -------------------------------------------------------------------------- */
    /*                                End lifecycle                               */
    /* -------------------------------------------------------------------------- */

    return (
      <Modal
        open={visibleModalss}
        onClose={() => {
          clearForm()
        }}
        center
        closeOnOverlayClick={false}
        closeOnEsc={false}
        classNames={{
          overlay: 'customOverlay'
        }}
      >
        {
          typeModal === 'delete' ?
            <Typography component="div" style={{}}>
              <Typography variant="subtitle1" style={{marginTop: '30px'}}>
                Yakin ingin hapus data ini ?
              </Typography>
              <Typography component="div" style={{ marginTop: '10px' }}>
                <Button 
                  onClick={()=>{
                    clearForm()
                  }} 
                  color="secondary" disabled={loadingCircular}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    httpDelete()
                  }}
                  disabled={loadingCircular}
                >
                  {
                    loadingCircular === false 
                    ? 'Hapus'
                    : <CircularProgress
                      size={20}
                      color="primary"
                    />
                  }
                </Button>
              </Typography>
            </Typography>
          :
          typeModal === 'create' || typeModal === 'update' ?
            <Typography component="div" style={{}}>
              <Typography component="h4">
                  { typeModal === 'create'? 'Tambah Item' : 'Edit Item'}
              </Typography>
              <Typography
                component="div"
                style={{ display: 'flex', flexDirection: 'column', marginTop: '0px' }}
              >
                {
                  DynamicForm.map((item, index) => {
                    return (
                      <TextField
                        key={`index-${index}`}
                        required
                        style={{ marginTop: '20px' }}
                        variant="outlined"
                        margin="dense"
                        label={item.label}
                        name={item.name}
                        type={item.name !== 'nama_barang' ? 'number' : 'default'}
                        size="small"
                        onChange={(e: any) => {
                          item.onChange(e.target.value)
                        }}
                        value={item.value}
                      />
                    )
                  })
                }

                <MemoPreviews imagePreview={eventImagePreview} imageContent={eventImageContent} isPublish={isPublishEdit} eventPublish={eventHandlerPublish} />
                {
                  typeModal === 'create' ?
                    imagePreview !== '' ?
                      <div className="">
                        <img
                          className={classes.foto_preview}
                          src={imagePreview}
                        />
                      </div>
                      : <div className="" style={{ width: '60px' }}></div>
                  :
                  imagePreview !== ''
                    ?
                    <div className="">
                      <img
                        className={classes.foto_preview}
                        src={imagePreview}
                      />
                    </div>
                    : <div className="" style={{ width: '60px' }}>
                      <img
                        className={classes.foto_preview}
                        src={`${DevImageUrl}/${imageOld}`}
                      />
                    </div>
                }

                <Typography component="div" style={{ marginTop: '10px' }}>
                  <Button
                    onClick={() => {
                      clearForm()
                    }}
                    color="secondary" disabled={loadingCircular}
                  >
                    Batal
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      typeModal === 'update' 
                      ? httpUpdate()
                      : httpPost()
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
            </Typography>
          :
          <Typography component="div" style={{}}></Typography>
        }
        
      </Modal>
    )
  }

export default CompModal
