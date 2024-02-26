import React, { useState } from 'react'
import { Spin,Tag } from 'antd'
import * as Styled from './style'
import { Login, Register } from './components'

const list = [
  {
    txt: '登录',
    type: 'login'
  },
  {
    txt: '注册',
    type: 'register'
  }
]

const largeTagStyle = {
  fontSize: '20px', // 设置标签的大字体大小
};

const Normal = (props) => {
  console.log("Normal",props)
  const [type, setType] = useState('login')
  const [loading, setLoading] = useState(false)

  return (
    <Styled.Wrap>
      <Spin spinning={loading}>
      <div style={{ textAlign: 'center' }}>
      <Styled.Header>
        <Tag bordered={false} style={largeTagStyle}>安全生产KMS系统v2.0</Tag>
      </Styled.Header>
      </div>
        <Styled.Header>
 
          {list.map((item) => (
            <div
              className={type === item.type ? 'active item' : 'item'}
              key={item.type}
              onClick={() => {
                setType(item.type)
              }}
            >
              {item.txt}
            </div>
          ))}
        </Styled.Header>
        {type === 'login' ? (
          <Login setLoading={setLoading} {...props} />
        ) : (
          <Register setLoading={setLoading} />
        )}
      </Spin>
    </Styled.Wrap>
  )
}

export default Normal
