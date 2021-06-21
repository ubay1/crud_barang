import { Button, CircularProgress, createStyles, FormControl, FormHelperText, makeStyles, TextField, Theme } from '@material-ui/core'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react'
import ThemeMUI from '../../helpers/theme';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setAuthStatus, setReduxUsername } from '../../store/user';
import { randomString } from "../../helpers/randomString";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: ThemeMUI.palette.primary.light,
			height: '100vh',
      display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column',
			alignItems: 'center',
		},
    form: {
      backgroundColor: '#fff',
      boxShadow: `0px 1px 2px grey`,
      padding: '40px',
      borderRadius: '5px'
    }
	}),
);

const Intro = () => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const [loadingCircular, setLoadingCircular] = useState(false);

  useEffect(() => {
    document.title = "Intro - Crud Barang"
  }, [])

  const formik = useFormik({
    initialValues: {
      nama: '',
    },
    onSubmit: values => {
      // console.log(JSON.stringify(values, null, 2));
      submitIntro(values)
    },
    validationSchema: Yup.object({
      nama: Yup.string()
        .required("nama wajib diisi"),
    })
  });

  const submitIntro = (params: {nama: string}) => {
    setLoadingCircular(true)
    dispatch(setAuthStatus({
      token: randomString(30, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    }))
    dispatch(setReduxUsername({
      nama: params.nama
    }))
    window.location.replace('/')

    localStorage.setItem('username',params.nama)
    setTimeout(() => {
      setLoadingCircular(false)
      // history.push('/')
    }, 1000);
  }

  return (
    <div className={classes.root}>
      <form 
        className={classes.form} 
        noValidate autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <FormControl 
          error={formik.errors.nama ? true : false} 
          variant="outlined" fullWidth
        >
          <TextField 
            id="outlined-basic"
            name="nama" 
            label="Masukan Namamu" 
            variant="outlined" 
            size="small"
            color="primary"
            onChange={formik.handleChange}
            value={formik.values.nama}
            style={{boxShadow: '0px 2px 2px lightgrey', borderRadius: '5px'}}
          />
          <FormHelperText style={{marginLeft: '0px'}}>{formik.errors.nama ? formik.errors.nama : ''}</FormHelperText>
        </FormControl>

        <div style={{marginTop: 10}}>
          <Button 
            variant="contained" 
            color="primary"
            disabled={loadingCircular}
            type="submit"
          >
            {
              loadingCircular === false ? 'Kirim'
              : <CircularProgress 
                size={20}
                color="primary"
              />
            }
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Intro
