import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Menu } from 'antd'
import { UserOutlined, FormOutlined, LogoutOutlined } from '@ant-design/icons'
import { AvatarWrap, DropdownWrap } from './styled'

const LogOutClick = () => {
  // 在此处执行你想要触发的函数调用
  console.log('logout clicked');
  window.localStorage.islogin = '0'
  sessionStorage.clear()
  
};

const menu = (
  <Menu>
    <Menu.Item icon={<FormOutlined />}>修改密码</Menu.Item>
    <Menu.Item icon={<LogoutOutlined />}>
      <Link to='/login' onClick={LogOutClick} >退出</Link>
    </Menu.Item>
  </Menu>
)

const MyAvartar = () => {
  return (
    <AvatarWrap overlay={menu} width={{ width: 120 }}>
      <DropdownWrap>
        <span style={{ marginRight: 10 }}>KMS</span>
        <Avatar
          icon={<UserOutlined />}
          src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        ></Avatar>
      </DropdownWrap>
    </AvatarWrap>
  )
}

export default MyAvartar
