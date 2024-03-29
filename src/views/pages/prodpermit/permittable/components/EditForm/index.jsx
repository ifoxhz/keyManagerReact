import React, { useEffect, useState } from 'react'
import { log } from '@ferrydjing/utils'
import { Form, Button, Input, Spin, notification } from 'antd'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}

const EditForm = (props) => {
  const { onCancel, onConfirm,PermitId } = props
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(0)
  const [form] = Form.useForm()

  const save = async (values) => {
    setLoading(true)
    log("update permit form:",values)
    // setTimeout(() => {
    //   setLoading(false)
    //   setStatus(1)
    // }, 2000)
    fetch('/api/permit/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
     })
      .then( (response) =>{
        if (response.status === 200) {
          setStatus(1)
        } else {
          notification.error({
            message: '证书通知',
            description: `update失败，请检查输入的产品参数:${values}`,
          });
          setStatus(0)
        }
        setLoading(false)
        })
      .catch( (err) =>{
        console.log(err)
        setLoading(false)
        setStatus(0)
        notification.error({
          message: '证书通知',
          description: `update zhengshu失败，后台服务异常`,
        });
      })
    setLoading(false)
  }

  const rules = {
    name: [
      {
        required: true,
        message: '必填'
      }
    ],
    age: [
      {
        required: true,
        message: '必填'
      },
      {
        pattern: /^((1[8-9])|(2[0-9])|(3[0-9])|(4[0-9])|(5[0-9])|60)$/,
        message: '请输入18-60'
      }
    ],
    count: [
      {
        required: true,
        message: '必填'
      },
      {
        pattern: /^[1-9]\d*$/,
        message: '请输入合理的数量'
      }
    ],
    address: [
      {
        required: true,
        message: '必填'
      }
    ]
  }

  useEffect(() => {
    if (status === 1) {
      setStatus(0)
      onConfirm()
      notification.success({ message: '新增成功' })
    }
  }, [onConfirm, status])

  return (
    <Spin tip='加载中' spinning={loading}>
      <Form {...layout} form={form} onFinish={save}>
        <Form.Item label='许可证名称' name='permitname' initialValue={PermitId.permitname} rules={rules.name}>
          <Input placeholder={PermitId.permitname}/>
        </Form.Item>
        <Form.Item label='许可证描述' name='permitlabel' initialValue={PermitId.permitlabel} rules={rules.name}>
          <Input placeholder={PermitId.permitlabel}/>
        </Form.Item>
        <Form.Item label='id' name='id' initialValue={PermitId.id}  style={{ display: 'none' }}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={onCancel} style={{ marginRight: 10 }}>
            取消
          </Button>
          <Button type='primary' htmlType='submit'>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default EditForm
