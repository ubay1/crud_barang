import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ThemeMUI from "../../helpers/theme";
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: ThemeMUI.palette.grey[900],
			height: '100vh'
		},
		text: {
			display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column',
			alignItems: 'center',
			color: 'white',
			height: '100%',
			fontSize: '20px',
		},
		text_back: {
			color: ThemeMUI.palette.primary.main
		}
	}),
);

const PageNotFound = () => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<div className={`${classes.text} base_font`}>
				<span>404 page Not Found</span>
				<Link className={classes.text_back} to="/"> kembali keberanda </Link>
			</div>
		</div>
	)
}

export default PageNotFound;