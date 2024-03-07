import { useState, useEffect } from 'react'
import { log } from '@ferrydjing/utils'
import { message, notification, Form } from 'antd'
import { useHistory } from 'react-router-dom'

async function verifyUser(user){
  return fetch('/api/auth/login', {
    method: 'POST',
    // credentials: 'omit',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    
}


const useLogin = (props) => {
  const { setLoading, setType} = props
  const history = useHistory()
  const [form] = Form.useForm()
  const [status, setStatus] = useState(0)
  const [defaultVal] = useState({
    username: '',
    password: ''
  })
  const [rules] = useState({
    username: [
      {
        required: true,
        message: '必填'
      },
      {
        pattern: /^[A-Za-z0-9~!@#$%^&*_.-]{2,20}$/,
        message: '请输入2-20位英文数字或特殊字符'
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
    ]
  })

  const save = async (values) => {
    setLoading(true)
    verifyUser({name:values.username,password:values.password})
      .then(response => {

        if (response.status === 200){
          return response.json()
        }else{
         return  Promise.resolve({UserValid:false})
        }
      })
      .then(data => {
          // 在这里处理响应的数据
          console.log("Login return ",data);
          if (data.UserValid){
            console.log("Login ok")
            // setIsAuthenticated(true)
            window.localStorage.islogin = '1'
            window.localStorage.sessionId = data.Session

            setLoading(false)
            setStatus(1)

          }else{
            setLoading(false)
            message.warning('用户名或者密码错误')
            window.localStorage.islogin = '0'
            history.push('/login')
          }
        
      })
      .catch(error => {
        // 在这里处理错误
        window.localStorage.islogin = '0'
        console.error("Login",error);
        setLoading(false)
        message.warning('登录服务错误，请重试')
      });
    /*
    if (values.username === 'admin' && values.password === '123456') {
      setTimeout(() => {
        setLoading(false)
        setStatus(1)
      }, 2000)
    } else {
      setLoading(false)
      message.warning('用户名密码错误')
    }*/
  }

  useEffect(() => {
    if (status === 1) {
      setStatus(0)
      notification.success({ message: '登录成功' })
      history.push('/index')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return { save, rules, form, setType, defaultVal }
}

export default useLogin
