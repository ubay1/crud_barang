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
      // console.log(props)
      if (!Cookies.get("token")) {
        return <Intro />;
      } else {
        alert('anda masih memiliki akses.')
        return <Redirect to={"/"} />;
      }
    }
  },
  { path: "/", 
    key: "APP_HOME", 
    exact: true, 
    component: (props: any) => {
      if (!Cookies.get("token")) {
        alert('anda tidak memiliki akses.')
        return <Redirect to={"/intro"} />;
      } else {
        // alert('anda masih memiliki akses.')
        return <Home />;;
      }
    }
  },
];

export default ROUTES;

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
function RouteWithSubRoutes(route: any) {
  // console.log('props compoennt route = ', dataSocket)
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={props => {
        return(<route.component {...props} routes={route.routes} />)
      }}
    />
  );
}

/**
 * Use this component for any new section of routes (any config object that has a "routes" property
 */
export function RenderRoutes({ routes, dataSocket }: any) {
  const userRedux = useSelector((state: RootState) => state.user)
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    if (userRedux.token !== '') {
      console.log('token ada')
    } else {
      initialStateUserAuthByAsync(dispatch)
    }
  }, [dispatch, userRedux.token])
  
  return (
    <Switch>
      {routes.map((route: any, i: number) => {
        return <RouteWithSubRoutes key={route.key} {...route} />;
      })}
      <Route component={() => <PageNotFound />} />
    </Switch>
  );
}