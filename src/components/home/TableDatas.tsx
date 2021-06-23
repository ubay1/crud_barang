import { Button, CircularProgress, colors, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, IconButton, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import { grey, pink } from '@material-ui/core/colors';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MUIDataTable from "mui-datatables";
import React, { useState } from 'react'
import { MdAdd, MdDelete, MdModeEdit } from "react-icons/md";
import ThemeMUI from '../../helpers/theme';
import { useDropzone } from 'react-dropzone';
import { HTTPAddBarang, HTTPDeleteBarang, HTTPReadBarang, HTTPUpdateBarang } from '../../helpers/http';
import { DevImageUrl } from '../../helpers/interceptors';
import { IAddBarang, IModalEdit } from '../../helpers/interfaceHttp';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './custom.css'
import CompModal from "./Modal";

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

const TableDatas = () => {

  const classes = useStyles()
  
  
  /* -------------------------------------------------------------------------- */
  /*                                  useState                                  */
  /* -------------------------------------------------------------------------- */
  const [databarang, setdatabarang] = useState<any[]>([])
  const [datatables, setdatatables] = React.useState([]);
  const [tipemodal, settipemodal] = useState('');
  const [visiblemodal, setvisiblemodal] = useState(false);
  /* -------------------------------------------------------------------------- */
  /*                                end useState                                */
  /* -------------------------------------------------------------------------- */
  
  /* -------------------------------------------------------------------------- */
  /*                                  datatable                                 */
  /* -------------------------------------------------------------------------- */
  const columns: any[] = [
    // { name: "id", label: "ID", },
    { name: "nama_barang", label: "Nama Barang",},
    { 
      name: "harga_beli", label: "Harga Beli", 
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            `Rp. ${formatRupiah(value)}`
          )
        }
      }
    },
    { 
      name: "harga_jual", label: "Harga Jual", 
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            `Rp. ${formatRupiah(value)}`
          )
        }
      }
    },
    {
      name: "foto", label: "Foto",
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <img src={`${DevImageUrl}/${value}`} style={{ width: '80px' }} />
          )
        }
      }
    },
    { name: "stok", label: "Stok", },
    {
      name: "id", label: "Actions",
      options: {
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <>
              <IconButton aria-label="delete"
                onClick={() => {
                  datatables.map((item: any) => {
                    if (item.id === value) {
                      setdatabarang(item)
                      settipemodal('update')
                      setvisiblemodal(true)
                    }
                  })
                }}
              >
                <MdModeEdit color="#2196f3" />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  datatables.map((item: any) => {
                    if (item.id === value) {
                      setdatabarang(item)
                      settipemodal('delete')
                      setvisiblemodal(true)
                    }
                  })
                }}
              >
                <MdDelete color="#e91e63" />
              </IconButton>
            </>
          )
        }
      }
    },
  ];
  let dataTable: any[] = datatables;
  /* -------------------------------------------------------------------------- */
  /*                                end datatable                               */
  /* -------------------------------------------------------------------------- */
  
  /* -------------------------------------------------------------------------- */
  /*                                  function                                  */
  /* -------------------------------------------------------------------------- */
  function eventcloseModal() {
    setdatabarang([])
    settipemodal('')
    setvisiblemodal(false)
    httpReadBarang()
  }

  function formatRupiah(value: any) {
    return new Intl.NumberFormat('id').format(value)
  }
  /* -------------------------------------------------------------------------- */
  /*                                end function                                */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                HTTP Request                                */
  /* -------------------------------------------------------------------------- */
  const httpReadBarang = async () => {
    try {
      const responeReadbarang = await HTTPReadBarang();
      setdatatables(responeReadbarang.data.data)
      console.log('get data: ', responeReadbarang.data.data)

    } catch (error) {
      console.log(error)
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                              End HTTP Request                              */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                  Lifecycle                                 */
  /* -------------------------------------------------------------------------- */
  React.useEffect(() => {
    httpReadBarang()
  }, [])
  /* -------------------------------------------------------------------------- */
  /*                                  End Lifecycle                             */
  /* -------------------------------------------------------------------------- */


  return (
    <Typography component="div" style={{ marginTop: '60px', marginBottom: '40px', marginLeft: '10px', marginRight: '10px' }}>

      <CompModal 
        visibleModal={visiblemodal}
        typeModal={tipemodal}
        closeModal={eventcloseModal}
        data={databarang}
      />

      <Button
        style={{ backgroundColor: ThemeMUI.palette.secondary.main, color: '#fff', marginBottom: '10px' }}
        variant="contained"
        onClick={() => {
          settipemodal('create')
          setvisiblemodal(true)
        }}
      >
        Tambah Barang
        <MdAdd />
      </Button>

      
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
          sort: false,
          rowsPerPageOptions: [5, 10],
        }}
      />
    </Typography>
  )
}

export default TableDatas
