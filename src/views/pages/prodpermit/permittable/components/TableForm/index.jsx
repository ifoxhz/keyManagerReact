import React, { useEffect, useState } from 'react'
import { log } from '@ferrydjing/utils'
import { Form, Button, Input, Spin, notification } from 'antd'
import { useSelector} from 'react-redux'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}

const TableForm = (props) => {
  const { onCancel, onConfirm,ProductId } = props
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(0)
  const [form] = Form.useForm()

  const editRecord = useSelector((state) => {
    return state.get("editRecord")
  }); // 从 Redux store 获取数据
  console.log("permit TableForm useSelector::::",editRecord)
  // const editItem = editRecord.editItem

  const save = async (values) => {
    setLoading(true)
    log("create permit form:",values)
    values.permitProdId = editRecord.editItem.id

    fetch('/api/permit/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
     })
      .then(async (response) =>{

        if (response.status === 200) {
          setStatus(1)
        } else {
          const errJson = await response.json()
          const errMsg = `创建证书失败，请检查输入的产品参数！错误：${errJson.resultMsg}`
          notification.error({
            message: '证书通知',
            description: errMsg
          });
          setStatus(0)
        }
        setLoading(false)
        })
      .catch( (err) =>{
        setLoading(false)
        setStatus(0)
        notification.error({
          message: '证书通知',
          description: `创建产品失败，后台服务异常`,
        });
      })

    setLoading(false)
    const { resetFields } = form;
    resetFields()
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

  // useEffect(() => {
  //   setProdId(editRecord.editItem.id)
  // }, [editRecord])

  return (
    <Spin tip='加载中' spinning={loading}>
      <Form {...layout} form={form} onFinish={save}>
        <Form.Item label='许可证名称' name='permitname' rules={rules.name}>
          <Input />
        </Form.Item>
        <Form.Item label='许可证描述' name='permitlabel' rules={rules.name}>
          <Input />
        </Form.Item>
        {/* <Form.Item label='permitProdId' name='permitProdId' hidden={true} >
          <Input type="hidden" name='permitProdId' value = {editRecord.editItem.id}/>
        </Form.Item> */}
        <Form.Item label='设备总量' name='permittotal' rules={rules.count}>
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

export default TableForm
