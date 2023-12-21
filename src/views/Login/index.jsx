import React, { memo, useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux'
import { Normal, Mobile } from './components'
import { notification } from 'antd'
import * as Styled from './style'

import {useHistory } from 'react-router-dom';

const Login = (props) => {
  console.log("first login",props)
  const { isAuthenticated} = props
  const { isMobile } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile'])
    }),
    shallowEqual
  )
  const history = useHistory();

  useEffect(() => {
    // notification.info({
    //   message: '提示',
    //   description: `
    //     用户名： admin
    //     密码： 123456
    //   `,
    //   duration: 0
    // })

    return () => {
      // notification.destroy()
    }
  }, [])
  if (isAuthenticated){
    console.log("login, 已经登录")
    return  <Redirect to="/index"/> //history.push('/index')
  }
  return <Styled.Wrap>{isMobile ? <Mobile /> : <Normal {...props} />}</Styled.Wrap>
}

export default memo(Login)
