/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Route, Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import Cookies from 'js-cookie';

import Home from '../pages/Home';
import Intro from '../pages/Intro';
import PageNotFound from '../pages/404';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { RootState } from '../store/rootReducer';
import { initialStateUserAuthByAsync } from '../store/user';

const ROUTES = [
  { path: "/intro", 
    key: "APP_INTRO", 
    exact: true, 
    component: (props: any) => {
      if (!Cookies.get("token")) {
        return <Intro {...props}/>;
      } else {
        return <Redirect to={{ pathname: "/", state: { message: 'anda masih memiliki akses.' } }} />;
      }
    }
  },
  { path: "/", 
    key: "APP_HOME", 
    exact: true, 
    component: (props: any) => {
      if (!Cookies.get("token")) {
        return <Redirect to={{ pathname: "/intro", state: { message: 'anda tidak memiliki akses.'} }} />;
      } else {
        return <Home {...props}/>;
      }
    }
  },
];

export default ROUTES;

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => {
        console.log('propss = ',props)
        return(<route.component {...props} routes={route.routes} />)
      }}
    />
  );
}

/**
 * Use this component for any new section of routes (any config object that has a "routes" property
 */
export function RenderRoutes({ routes }: any) {
  const userRedux = useSelector((state: RootState) => state.user)
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    if (userRedux.token !== '') {
      console.log('%ctoken ada', 'background:#000; padding:10px; color:#fff;')
    } else {
      initialStateUserAuthByAsync(dispatch)
    }
  }, [dispatch, userRedux.token])
  
  return (
    <Switch>
      {routes.map((route: any, i: number) => {
        // console.log('routes = ',route)
        return <RouteWithSubRoutes key={route.key} {...route} />;
      })}
      <Route component={() => <PageNotFound />} />
    </Switch>
  );
}