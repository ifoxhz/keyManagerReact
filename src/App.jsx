import React, { memo, Suspense, useEffect, useState } from 'react'
import { HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import fp from 'lodash/fp'
import { DefaultLayout, NotFound, Login } from './routers'
import * as actionCreaters from './store/base/actionCreaters'
import { PageLoading } from '_c'

import { useLocation, useHistory, Link } from 'react-router-dom'


// const PrivateRoute = ({ component: component, ...rest }) => {
//   const isAuthenticated = window.localStorage.islogin
//   console.log("PrivateRoute:", isAuthenticated)
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = window.localStorage.islogin
  console.log("ProtectedRoute:", isAuthenticated)
  if (!isAuthenticated) {
    // user is not authenticated
    return <Redirect to="/login" />;
  }
  return children;
};

// window.localStorage.islogin = '0'

const App = () => {
  const dispatch = useDispatch()
  const { isMobile, screenWidth, screenHeight } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile']),
      screenWidth: state.getIn(['base', 'screenWidth']),
      screenHeight: state.getIn(['base', 'screenHeight'])
    }),
    shallowEqual
  )

    const setBasicInfo = () => {
    // eslint-disable-next-line no-mixed-operators
    if (isMobile !== document.body.clientWidth < 768) {
      dispatch(actionCreaters.setIsMobile(document.body.clientWidth < 768))
    }
    if (screenWidth !== document.documentElement.clientWidth) {
      dispatch(
        actionCreaters.setScreenWidth(document.documentElement.clientWidth)
      )
    }

    if (screenHeight !== document.documentElement.clientHeight) {
      dispatch(
        actionCreaters.setScreenHeight(document.documentElement.clientHeight)
      )
    }
  }
  const resizeFn = fp.throttle(300, () => {
    setBasicInfo()
  })

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const SessionOut = useSelector((state) => {
    return state.get("SessionOut")
  }); // 从 Redux store 获取数据

  useEffect(() => {
    if (SessionOut){
      console.log("sesssout ")
      // window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SessionOut])


  useEffect(() => {
    resizeFn()
    window.addEventListener('resize', resizeFn, false)
    return () => {
      window.removeEventListener('resize', resizeFn)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenHeight, screenWidth, isMobile])

  return (
    <Suspense fallback={<PageLoading />}>
      <Router>
        <Switch>
          <Route path='/' exact render={() => {
              return (window.localStorage.islogin === '1' ? <Redirect to='/index' />:<Redirect to='/login' />) 
          }} />
          <Route path='/login' component={(props)=><Login {...props} />} />
          <Route path='/404' render={ () => {
              return (window.localStorage.islogin === '1' ?<NotFound /> :<Redirect to='/login' />)
          }} />
          <Route render={(props) =>{
              return (window.localStorage.islogin === '1' ? <DefaultLayout {...props}/> :<Redirect to='/login' />)
          }} />
        </Switch>
      </Router>
    </Suspense>
  )
}

export default memo(App)
