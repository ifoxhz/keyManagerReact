import React, { useRef, useEffect, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Form, Input, Button, Modal, Row, Col,Select, Space,notification,message } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { DeviceTable } from '_c'
import * as Styled from './style'
import TableForm from './components/TableForm'

const { Option } = Select;

const url = "/api/permitdevice"

const PermitDevice = (props) => {
  let {editItem} = props
  const [form] = Form.useForm();

  const { isMobile } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile'])
    }),
    shallowEqual
  )


  const editRecord = useSelector((state) => {  
    return state.get("editRecord")
  }); // 从 Redux store 获取数据
  
  const[nameOptions,setNameOptions] = useState([])


  const [title] = useState('新增')
  const [visible, setVisible] = useState(false)


  const [Modalvisible, setModalvisible] = useState(false); // 控制模态框显示与隐藏
  const [DelRecord, setDelRecord] = useState(null); // 当前选中的行数据
  const [loading,setLoading] = useState(false)

  const tableRef = useRef(null)

  const onFinish = (values) => {

    if (values.permitname === undefined && values.cid === undefined){

      message.info('许可证，或者设备号不能同时为空！');
      return
    }

    values.permitProdId = editItem.id

    tableRef.current.refresh(values)

    form.resetFields()

  };


  const getPermitNameList = async(product)=> {
    try{
      const url = `/api/permit/namelist?permitProdId=${product.id}`
      const response = await  fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
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
  useEffect(()=>{
    getPermitNameList(editItem)
  },[editItem])

  useEffect(()=>{
    console.log("refresh select 组件")
  },[nameOptions])

  
  useEffect(()=>{
    editItem = editRecord.editItem
    tableRef.current.cleanDataSource()
    console.log("useEffect refresh editItem",editItem)
  },[editRecord])


  return (

    <Styled.Wrap>
      <Styled.Header>
        <Form form={form} className={{ 'header-form': true, 'not-flex': isMobile }} onFinish={onFinish} >
        <Row gutter={16}>
        <Col span={12}>
          <Form.Item  name="permitname">
            <Select  placeholder="请选择许可证" options={nameOptions} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item  name="usedflag">
            <Select placeholder="请选择状态"  allowClear  options={[{value:true,label:"已下载"},{value:false,label:"未下载"}]}>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="cid" >
            <Input placeholder="请输入设备号" />
          </Form.Item>
        </Col>
        {/* <Col span={12}>
          <Form.Item name="productionline" >
            <Input placeholder="请输入产线号" />
          </Form.Item>
        </Col> */}
      </Row>
          <div className='item-wrap'>
          <Space>
            <Form.Item className='btn-wrap'>
              <Button type='primary' htmlType="submit" >查询</Button>
            </Form.Item>
            </Space>
          </div>
        </Form>
      </Styled.Header>
      <Styled.Content>
        {/* <div className='header'>
          <div className='left'>证书</div>
          <div className='right'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setVisible(true)
              }}
            >
              新建
            </Button>
            <Button
              type='primary'
              icon={<RedoOutlined />}
              onClick={() => {
                tableRef && tableRef.current.refresh(editItem)
              }}
            >
              刷新
            </Button>
          </div>
        </div> */}
        {/* <Modal
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
           */}
        <DeviceTable
          // columns={columns}
          ref={tableRef}
          checked
          url='/api/permitdevice'
        ></DeviceTable>
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
              tableRef && tableRef.current.refresh(editItem)
            }}
            ProductId = {editItem.id}
          ></TableForm>
        ) : null}
      </Modal>
    </Styled.Wrap>
  )
}

export default PermitDevice
