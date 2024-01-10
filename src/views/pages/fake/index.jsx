import React, { useRef, useEffect, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Form, Input, Button, Modal,Space,Row,Col,Select,notification } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { FerryTable } from '_c'
import * as Styled from './style'
import TableForm from './components/TableForm'
import {Papa} from 'papaparse'

const { Option } = Select;

const FakeDevice = (props) => {

  const { isMobile } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile'])
    }),
    shallowEqual
  )

  
  const [title] = useState('新增')
  const [visible, setVisible] = useState(false)
  const [editvisible, setEditVisible] = useState(false)


  const [Modalvisible, setModalvisible] = useState(false); // 控制模态框显示与隐藏
  const [DelRecord, setDelRecord] = useState(null); // 当前选中的行数据
  const [editRecord, setEditRecord] = useState(null); // 当前选中的行数据

  const[nameOptions,setNameOptions] = useState([])

  const tableRef = useRef(null)

  useEffect(() => {}, [])

  const handleDelete = (record) => {
    setDelRecord(record);
    setModalvisible(true);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditVisible(true);
    console.log("edit permit")
  };

  const handleConfirmDelete = () => {
    // const newData = data.filter((item) => item.id !== selectedRecord.id);
    console.log("execute permit delete",DelRecord)
    tableRef && tableRef.current.del(DelRecord,"/api/permit/delete")
    // setData(newData);
    setModalvisible(false);
  };

  const handleCancelDelete = () => {
    setModalvisible(false);
  };

  const onFinish =  (values)=>{
    console.log("post fake device",values)
    CreatePermitDevice(values)

  }

  const getPermitNameList = async()=> {
    try{
     const response = await  fetch("/api/permit/namelist", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
       })
      if (response.status === 200) {
        const result = await response.json()
        console.log("SelectOptions data",result)
        const tmpOpt = result.Data.map((item)=>{
          return {value:item.permitname,label:item.permitname}
        })
        console.log("SelectOptions true value:",tmpOpt)
        setNameOptions(tmpOpt)
        return 
      }
    }catch(e){
      console.log("getPermitNameList",e)
      notification.error({
        message: 'API调用失败',
        description: `获取证书名字列表失败`,
      });
      return 
    }
  }

  const CreatePermitDevice = async(values)=> {
    try{
      values.permitid = 10
     const response = await  fetch("/api/permitdevice/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
       })
      if (response.status === 200) {
        const result = await response.json()
        console.log("CreatePermitDevice data",result)
        return 
      }
    }catch(e){
      console.log("CreatePermitDevice",e)
      notification.error({
        message: 'API调用失败',
        description: `创建失败`,
      });
      return 
    }
  }

  useEffect(()=>{
    getPermitNameList()
  },[])

  return (
    <Styled.Wrap>
      <Styled.Header>
      <Form className={{ 'header-form': true, 'not-flex': isMobile }} onFinish={onFinish}>
        <Row gutter={16}>
        <Col span={12}>
          <Form.Item  name="permitname">
            <Select  placeholder="请选择许可证" options={nameOptions} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item  name="permitstatus">
            <Select placeholder="请选择状态"  options={[{value:"Used",label:"已使用"},{value:"Unused",label:"为使用"}]}>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="deviceid" >
            <Input placeholder="请输入设备号" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="productionline" >
            <Input placeholder="请输入产线号" />
          </Form.Item>
        </Col>
      </Row>
          <div className='item-wrap'>
          <Space>
            <Form.Item className='btn-wrap'>
              <Button type='primary' htmlType="submit" >提交</Button>
            </Form.Item>
            </Space>
          </div>
        </Form>
      </Styled.Header>
      <Styled.Content>
        <Modal
          title="删除确认"
          visible={Modalvisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="删除"
          cancelText="取消"
        >
        <p>确定要删除该记录：</p>
        <pre>
        
        </pre>
        <p>证书名称: <strong>{DelRecord && DelRecord.permitname}</strong> </p>
        <p>证书描述: <strong>{DelRecord && DelRecord.permitlabel}</strong></p>
        </Modal>
        
      </Styled.Content>
      <Modal
        title={title}
        visible={visible}
        footer={null}
        width={750}
        onCancel={() => {
          setVisible(false)
        }}
      >
        {visible ? (
          <TableForm
            onCancel={() => {
              setVisible(false)
            }}
            onConfirm={() => {
              setVisible(false)
              // tableRef && tableRef.current.refresh(editItem)
            }}
          ></TableForm>
        ) : null}
      </Modal>
    </Styled.Wrap>
  )
}

export default FakeDevice
