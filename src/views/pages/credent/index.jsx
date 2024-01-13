import React, { useRef, useEffect, useState } from 'react'
import { useSelector, shallowEqual, useDispatch  } from 'react-redux'
import { Form, Input, Button, Modal,Space } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { ComTable } from '_c'
import * as Styled from './style'
import { useHistory } from 'react-router-dom'

const CredentTable = (props) => {
  const { isMobile } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile'])
    }),
    shallowEqual
  )

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'CID',
      dataIndex: 'cid'
    },
    {
      title: 'HUK',
      dataIndex: 'huk'
    },
    {
      title: '是否使用',
      dataIndex: 'usedflag',
      render: (usedflag) => (usedflag ? '是' : '否'),
    },
    {
      title: 'CREDENTIAL',
      dataIndex: 'credential'
    },
    {
      title: 'KP',
      dataIndex: 'keyprovision'
    },
    
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (date) => {return (new Date(date)).toLocaleString('zh-CN')}
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: (text, record) => (
    //     <Space size="middle">
    //      <Button onClick={() => handleDelete(record)} size="middle">删除</Button>
    //      <Button onClick={() => handleEdit(record)} size="middle">编辑</Button>
    //     </Space>
    //   ),
    // },
  ]
  
  
  const [title] = useState('新增')
  const [visible, setVisible] = useState(false)

  const [Modalvisible, setModalvisible] = useState(false); // 控制模态框显示与隐藏
  const [DelRecord, setDelRecord] = useState(null); // 当前选中的行数据
  const [permitVisible, setPermitVisible] = useState(false)

  // const [EditRecord,setEditRecord] =useState(null)

  const [redLogin, setRedLogin] = useState(false)

  const tableRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {}, [])

  useEffect(() => {
    if (redLogin){
      console.log("redirect login")
      history = useHistory()
      history.push('/login')
    }
    return ( )=>{
      setRedLogin(false)
    }
  }, [redLogin])

  // const handleDelete = (record) => {
  //   setDelRecord(record);
  //   setModalvisible(true);
  // };

  // const handleEdit = (record) => {
  //   // const dispatch = useDispatch();
  //   console.log("dispatch edit")
  //   dispatch({type: 'SET_PROD_EDIT_RECORD', payload: {item: record}});
  //   setPermitVisible(true)
  //   // setEditRecord(record)
  //   // setModalvisible(true);
  // };

  // useEffect((editRecord) => {
  //   dispatch({type: 'SET_PROD_EDIT_RECORD', payload: {items: [editRecord]}});
  // }, [EditRecord])


  const handleConfirmDelete = () => {
    // const newData = data.filter((item) => item.id !== selectedRecord.id);
    console.log("execute delete",DelRecord)
    tableRef && tableRef.current.del(DelRecord,"/api/product/delete")
    // setData(newData);
    setModalvisible(false);
  };

  const handleCancelDelete = () => {
    setModalvisible(false);
  };

  return (
    <Styled.Wrap>
      <Styled.Header>
        {/* <Form className={{ 'header-form': true, 'not-flex': isMobile }}>
          <div className='item-wrap'>
            <Form.Item label='规则名称'>
              <Input placeholder='请输入'></Input>
            </Form.Item>
          </div>
          <div className='item-wrap'>
            <Form.Item label='描述'>
              <Input placeholder='请输入'></Input>
            </Form.Item>
          </div>
          <div className='item-wrap'>
            <Form.Item label='服务调用次数'>
              <Input placeholder='请输入'></Input>
            </Form.Item>
          </div>
          <div className='item-wrap'>
            <Form.Item label='状态'>
              <Input placeholder='请输入'></Input>
            </Form.Item>
          </div>
          <div className='item-wrap'>
            <Form.Item className='btn-wrap'>
              <Button>重置</Button>
              <Button type='primary'>查询</Button>
            </Form.Item>
          </div>
        </Form> */}
      </Styled.Header>
      <Styled.Content>
        <div className='header'>
          <div className='left'>查询表格</div>
          <div className='right'>
            <Button
              type='primary'
              icon={<RedoOutlined />}
              onClick={() => {
                tableRef && tableRef.current.refresh("/api/credent/get")
              }}
            >
              刷新
            </Button>
          </div>
        </div>  
        <ComTable
          columns={columns}
          ref={tableRef}
          checked
          url='/api/credent'
        ></ComTable>
      </Styled.Content>
    </Styled.Wrap>
  )
}

export default CredentTable
