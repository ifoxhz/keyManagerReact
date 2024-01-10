import React, { useRef, useEffect, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Form, Input, Button, Modal, Row, Col,Select, Space,notification } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { DeviceTable } from '_c'
import * as Styled from './style'
import TableForm from './components/TableForm'

const { Option } = Select;

const url = "/api/permitdevice"

const PermitDevice = (props) => {
  const {editItem} = props
  const { isMobile } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile'])
    }),
    shallowEqual
  )

  const columns = [
    {
      title: '设备号',
      dataIndex: 'permitdevice'
    },
    {
      title: '许可证名称',
      dataIndex: 'permitname'
    },
    {
      title: '状态',
      dataIndex: 'permitstatus'
    },
    {
      title: '异常描述',
      dataIndex: 'permitedesc'
    },
    {
      title: '创建时间',
      dataIndex: 'createtime'
    },
    {
      title: '最近操作时间',
      dataIndex: 'operatetime'
    },
  ]
  
  const[nameOptions,setNameOptions] = useState([])


  const [title] = useState('新增')
  const [visible, setVisible] = useState(false)


  const [Modalvisible, setModalvisible] = useState(false); // 控制模态框显示与隐藏
  const [DelRecord, setDelRecord] = useState(null); // 当前选中的行数据
  const [loading,setLoading] = useState(false)

  const tableRef = useRef(null)

  useEffect(() => {}, [])

  const handleDelete = (record) => {
    setDelRecord(record);
    setModalvisible(true);
  };

  const onFinish = (values) => {
    // setDelRecord(record);
    // setModalvisible(true);
    console.log("PermitDevice onFinish",values)

    tableRef.current.refresh(values)

  };

  // const fetchData = async (record) => {
  //   console.log(" permitdevice fetch Data",record)
  //   setLoading(true)

  //   let  serverUrl = url + "/get" + `?pageSize=${query.row}&offset=${query.row*(query.page-1)}`
    
  //   serverUrl = serverUrl + record.permitname ?`&permitname=${record.permitname}`:null
  //   serverUrl = serverUrl + record.permitstatus ?`&permitstatus=${record.permitstatus}`:null
  //   serverUrl = serverUrl + record.deviceid ?`&permitname=${record.deviceid}`:null
  //   serverUrl = serverUrl + record.productionline ?`&permitname=${record.productionline}`:null

  //   console.log("permitdevice url" ,serverUrl)
  //   try {
  //     const response = await fetch(serverUrl, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //     })
  //     const result = await response.json();
  //     // const reData = JSON.parse(result)
  //     let reData = result

  //     console.log("reData",reData)
        
  //     setLoading(false)
  //     setData({
  //       ...query,
  //       count: reData.Data.count,
  //       list: reData.Data.list
  //     })
  //     if (selectTotalKeys[query.page]) {
  //       let curRow = selectTotalKeys[query.page]
  //       let arr = []
  //       reData.list.forEach((item) => {
  //         if (curRow.indexOf(item.id) !== -1) {
  //           arr.push(item.id)
  //         }
  //       })
  //       setSelectTotalKeys({
  //         ...selectTotalKeys,
  //         [query.page]: [...arr]
  //       })
  //   }
  // } catch (error) {
  //     setLoading(false)
  //     setData({
  //       ...query,
  //       count: dataDeafaul.length,
  //       list: dataDeafaul
  //     })
  //   }
  // }

  const handleConfirmDelete = () => {
    // const newData = data.filter((item) => item.id !== selectedRecord.id);
    console.log("execute permit delete",DelRecord)
    tableRef && tableRef.current.del(DelRecord,"/api/permitdevice/delete")
    // setData(newData);
    setModalvisible(false);
  };

  const handleCancelDelete = () => {
    setModalvisible(false);
  };

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
  useEffect(()=>{
    getPermitNameList()
  },[])

  useEffect(()=>{
    console.log("refresh select 组件")
  },[nameOptions])

  

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
            <Select placeholder="请选择状态"  options={[{value:"Used",label:"已使用"},{value:"Unused",label:"未使用"}]}>
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
          columns={columns}
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
