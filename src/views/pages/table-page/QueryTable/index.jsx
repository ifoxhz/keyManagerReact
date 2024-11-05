import React, { useRef, useEffect, useState } from 'react'
import { useSelector, shallowEqual, useDispatch  } from 'react-redux'
import { Form, Input, Button, Modal,Space } from 'antd'
import { PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { FerryTable } from '_c'
import * as Styled from './style'
import TableForm from './components/TableForm'
import ProdPermit from '@/views/pages/prodpermit'
import { useHistory } from 'react-router-dom'


const QueryTable = (props) => {
  const { isMobile } = useSelector(
    (state) => ({
      isMobile: state.getIn(['base', 'isMobile'])
    }),
    shallowEqual
  )

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productname'
    },
    {
      title: '产品型号',
      dataIndex: 'productmodel'
    },
    {
      title: '芯片型号',
      dataIndex: 'chipmodel'
    },
    {
      title: '创建证书总量',
      render: (text, record) => {
        return (record.devicetotal ? record.devicetotal : 0)
      }
    },
    {
      title: '已下载证书总数',
      render: (text, record) => {
        return (record.devicebalance ? record.devicebalance : 0)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      render: (date) => {return (new Date(date)).toLocaleString('zh-CN')}
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
         <Button onClick={() => handleDelete(record)} size="middle">删除</Button>
         <Button onClick={() => handleEdit(record)} size="middle">编辑</Button>
         <Button onClick={() => handleRemainingQuery(record)} size="middle">余额</Button>
        </Space>
      ),
    },
  ]
  
  
  const [title] = useState('新增')
  const [visible, setVisible] = useState(false)

  const [Modalvisible, setModalvisible] = useState(false); // 控制模态框显示与隐藏
  const [DelRecord, setDelRecord] = useState(null); // 当前选中的行数据
  const [permitVisible, setPermitVisible] = useState(false)

  const [loading, setLoading] = useState(false);
  const [isRemainingVisible, setRemainingVisible] = useState(false);
  const [remainingData, setRemainingData] = useState(null);

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

  const handleDelete = (record) => {
    setDelRecord(record);
    setModalvisible(true);
  };

  const handleEdit = (record) => {
    // const dispatch = useDispatch();
    console.log("dispatch edit")
    dispatch({type: 'SET_PROD_EDIT_RECORD', payload: {item: record}});
    setPermitVisible(true)
    // setEditRecord(record)
    // setModalvisible(true);
  };

  const handleRemainingQuery = async (record) => {
      setLoading(true);
      setRemainingVisible(true);

      try {
        // const response = await fetch('https://your-api-endpoint.com/product/get');
        const response = await fetch('/api/product/getRemainingPermit', 
          { method: 'POST', body: JSON.stringify({chipmodel:record.chipmodel}) });
        if (!response.ok) {
          setRemainingData('Network response was not ok');
          setLoading(false);
          return
        }
        const result = await response.json();
        setRemainingData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRemainingData({ error: 'Failed to load data' });
        setLoading(false);
      }
    };

 

  // useEffect((editRecord) => {
  //   dispatch({type: 'SET_PROD_EDIT_RECORD', payload: {items: [editRecord]}});
  // }, [EditRecord])

   
  const handleOk = () => {
    setRemainingVisible(false);
    setRemainingData(null); // Clear the data when closing the modal
  };

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
                tableRef && tableRef.current.refresh("/api/product/get")
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
        <p>产品名称: <strong>{DelRecord && DelRecord.productname}</strong> </p>
        <p>产品型号: <strong>{DelRecord && DelRecord.productmodel}</strong></p>
        <p>芯片型号: <strong>{DelRecord && DelRecord.chipmodel}</strong></p>
        <p>设备总量: <strong>{DelRecord && DelRecord.devicetotal}</strong></p>
        <p>创建时间: <strong>{DelRecord && (new Date(DelRecord.createtime)).toLocaleString('zh-CN')}</strong></p>
        </Modal>
          
        <FerryTable
          columns={columns}
          ref={tableRef}
          checked
          url='/api/product'
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
              tableRef && tableRef.current.refresh("/api/product/get")
            }}
          ></TableForm>
        ) : null}
      </Modal>

    {/* permit modal */}

    <Modal
        title={"许可证"}
        visible={permitVisible}
        footer={null}
        onCancel={() => {
          setPermitVisible(false)
        }}
        width="80%"
      >
        {permitVisible ? (
          <ProdPermit
            onCancel={() => {
              setPermitVisible(false)
            }}
          ></ProdPermit>
        ) : null}
      </Modal>

      <Modal
        title="Remaining data"
        visible={isRemainingVisible}
        onOk={handleOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
        centered
      >
        {loading ? (
          <><p>加载中</p></>
        ) : (
          <p>{remainingData ? JSON.stringify(remainingData) : 'No data available'}</p>
        )}
      </Modal>

    </Styled.Wrap>
  )
}

export default QueryTable
