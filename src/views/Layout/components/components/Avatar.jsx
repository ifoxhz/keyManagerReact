import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Menu, Modal, Form, Input, Button,Divider,notification } from 'antd'
import { UserOutlined, FormOutlined, LogoutOutlined } from '@ant-design/icons'
import { AvatarWrap, DropdownWrap } from './styled'
import history from '@/common/history'


const LogOutClick = () => {
  // 在此处执行你想要触发的函数调用
  console.log('logout clicked');
  window.localStorage.islogin = '0'
  sessionStorage.clear()
  
};

const rules = {
 
  oldpwd: [
    {
      required: true,
      message: '必选'
    }
  ],
  password: [
    {
      required: true,
      message: '必填'
    },
    {
      pattern: /^[A-Za-z0-9~!@#$%^&*_.-]{6,20}$/,
      message: '请输入6-20位英文数字或特殊字符'
    }
  ],
  confirm_password: [
    {
      required: true,
      message: '必填'
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve()
        }
        return Promise.reject('两次输入的密码不一致')
      }
    })
  ],
  }


  async function changePass(values){
    return fetch('/api/user/updatepawd', {
      method: 'POST',
      // credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      
  }
  


const ChaPaModal = (props) => {
  const {visible, setVisible} = props;
  const [form] = Form.useForm()


    const handleCancel = () => {
    // 处理取消按钮操作
    // setVisible(false);
    console.log("取消修改")
    setVisible(false)
  };
  const save = (values) => {
    console.log("change passwd values:",values)
    values.name = window.localStorage.sessionId
    setVisible(false)
    changePass(values)
    .then( (response) =>{
      if (response.status === 200) {
        // setStatus(1)
        notification.success({ message: '密码修改成功' })
        history.push('/login')
      } else {
        notification.error({
          message: '密码通知',
          description: `修改用户密码失败`,
        });
        // setStatus(0)
      }
      })
    .catch( (err) =>{
      console.log(err)
      // setStatus(0)
      notification.error({
        message: '密码通知',
        description: `修改用户密码失败，后台服务异常`,
      });
    })
    form.resetFields();
  }

  const dividerStyle = {
    marginTop: '16px', // 设置顶部间距
    marginBottom: '16px' // 设置底部间距
  };


  return (
    <div>
      <Modal
        title="密码修改"
        visible={visible}
        // onOk={handleOk}
        onCancel={handleCancel} // 
        footer={[
        <Button key="cancel" onClick={handleCancel}>取消</Button>
      ]}
      >


<p>用户: {window.localStorage.sessionId} </p>
<Divider style={dividerStyle} />

<Form form={form} onFinish={save}>  
<Form.Item label='原密码 ' name='oldpassword' rules={rules.oldpwd}>
    <Input.Password placeholder='请输入原密码' autoComplete="new-password" />
  </Form.Item>
  <Form.Item label='新密码 ' name='password' rules={rules.password}>
    <Input.Password placeholder='请输入密码' />
  </Form.Item>
  <Form.Item
    label='确认密码'
    name='confirm_password'
    rules={rules.confirm_password}
  >
    <Input.Password placeholder='请确认密码' />
  </Form.Item>

    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
    <Button type='primary' htmlType='submit'>
      确定
    </Button>
  </Form.Item>
</Form>


      </Modal>
    </div>
  );
};




const MyAvartar = () => {

  const [movisible,setMovisible] = useState(false)
  const chPaOnClick = ()=>{
    setMovisible(true)
  }
  const menu = (
    <Menu>
      <Menu.Item icon={<FormOutlined />} onClick={chPaOnClick}>修改密码</Menu.Item>
      <Menu.Item icon={<LogoutOutlined />}>
        <Link to='/login' onClick={LogOutClick} >退出</Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
    <AvatarWrap overlay={menu} width={{ width: 120 }}>
      <DropdownWrap>
        <span style={{ marginRight: 10 }}>KMS</span>
        <Avatar
          icon={<UserOutlined />}
          src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
        ></Avatar>
      </DropdownWrap>
    </AvatarWrap>
      <ChaPaModal visible={movisible} setVisible={setMovisible} />
    </div>
  )
}

export default MyAvartar
