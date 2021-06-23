import { makeStyles, AppBar, Toolbar, Typography, Button, MenuItem, Menu } from '@material-ui/core';
import { cleanup } from '@testing-library/react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { IoLogOutOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store/rootReducer';
import TableDatas from "../../components/home/TableDatas";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Pacifico'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));


const Home = (props: any) => {
  const classes = useStyles();
  const history = useHistory();

  const userRedux = useSelector((state: RootState) => state.user)

  const [anchorEl, setAnchorEl] = useState(null);

  const [username, setusername] = useState('');

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setusername(userRedux.nama)
  }, [userRedux.nama])

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary">
        <Toolbar variant="dense">
          <Typography className={`${classes.title}`} variant="h6" color="inherit">
            Stok Barang
          </Typography>
          <Button aria-controls="simple-menu" aria-haspopup="true" color="inherit" onClick={handleClick}>
            {username}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem 
              onClick={()=>{
                Cookies.remove('token')
                localStorage.removeItem('username')
                // window.location.replace('/intro')
                history.push('/intro')
              }}
            >Keluar</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <TableDatas />
    </div>
  )
}

export default Home
