import React, { useRef, useEffect, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Form, Input, Button, Modal,Space } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { FerryTable } from '_c'
import * as Styled from './style'
import TableForm from './components/TableForm'
import EditForm from './components/EditForm'
import {Papa} from 'papaparse'


const PermitTable = (props) => {
  const {editItem} = props
  const { isMobile } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile'])
    }),
    shallowEqual
  )

  const columns = [
    {
      title: '许可证名称',
      dataIndex: 'permitname'
    },
    {
      title: '许可证描述',
      dataIndex: 'permitlabel'
    },
    {
      title: '总额',
      dataIndex: 'permittotal'
    },
    {
      title: '未拉取',
      dataIndex: 'permitbalance'
    },
    {
      title: '已拉取',
      dataIndex: 'permitpullcount'
    },
    {
      title: '已下载',
      dataIndex: 'permitusedcount'
    },
    {
      title: '未下载',
      render: (text, record) => {
        return (record.permitpullcount - record.permitusedcount)
      }
    },
    {
      title: '异常数',
      dataIndex: 'permiterrorcount'
    },
    {
      title: '状态',
      render: (text, record) => {
        return ((record.permittotal === record.permitpullcount)? "可用":"创建中")
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
         <Button onClick={() => handleDelete(record)} size="middle">删除</Button>
         <Button onClick={() => handleEdit(record)} size="middle">编辑</Button>
        </Space>
      ),
    },
  ]
  
  
  const [title] = useState('新增')
  const [visible, setVisible] = useState(false)
  const [editvisible, setEditVisible] = useState(false)


  const [Modalvisible, setModalvisible] = useState(false); // 控制模态框显示与隐藏
  const [DelRecord, setDelRecord] = useState(null); // 当前选中的行数据
  const [editRecord, setEditRecord] = useState(null); // 当前选中的行数据

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
        </div>
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
          
        <FerryTable
          columns={columns}
          ref={tableRef}
          checked
          url='/api/permit'
          editItem = {editItem}
        ></FerryTable>
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
      <Modal
        title={"编辑证书"}
        visible={editvisible}
        footer={null}
        width={750}
        onCancel={() => {
          setEditVisible(false)
        }}
      >
        {editvisible ? (
          <EditForm
            onCancel={() => {
              setEditVisible(false)
            }}
            onConfirm={() => {
              setEditVisible(false)
              tableRef && tableRef.current.refresh(editItem)
            }}
            PermitId = {editRecord}
          ></EditForm>
        ) : null}
      </Modal>
    </Styled.Wrap>
  )
}

export default PermitTable
