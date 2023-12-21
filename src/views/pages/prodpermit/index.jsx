import React , {useState} from 'react';
import { useSelector} from 'react-redux';
import { Tabs, Table, Form, Upload, Button, Input, Space } from 'antd';
import { Col, Row, Radio } from 'antd';
import PermitTable from "./permittable"
import PermitDevice from './permidevice';
import Papa from 'papaparse'

const { TabPane } = Tabs;


const KeyUploader = () => {
    const [fileContent, setFileContent] = useState(null);
  
    const handlebeforeUpload = (file) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          const content = e.target.result;
          setFileContent(content);
        }; 
    };
  
    return (
      <div>
        <Upload beforeUpload={handlebeforeUpload}>
          <Button>选择文件</Button>
        </Upload>
  
        {fileContent && (
          <div>
            <h3>文件内容：</h3>
            <pre>{fileContent}</pre>
          </div>
        )}
      </div>
    );
  };

  
function ProductkeyItem ({prodkeyText}) {

  console.log("ProductkeyItem:",prodkeyText)
  const result = Papa.parse(prodkeyText)
  const items = result.data
  console.log("ProductkeyItem  pare items:",items)

  return (
    <>
    {
      items.map((item,index) => {
           if(item[0]){
            return (
              <Form.Item label={item[0]} key={index}>
              <Input  value= {item[1]} disabled/>
              </Form.Item>
            )
          }else{
            return null
          }
      })   
    }
    </>
  )
    
}



const ProdPermit = () => {
    const editRecord = useSelector((state) => {
       return state.get("editRecord")
    }); // 从 Redux store 获取数据
    console.log("useSelector::::",editRecord)
    const editItem = editRecord.editItem
    console.log("useSelector editItem", editItem)
    // const dispatch = useDispatch(); // 获取 dispatch 函数
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
          title: '设备总量',
          dataIndex: 'devicetotal'
        },
        {
          title: '设备余额',
          dataIndex: 'devicebalance'
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
             <Button size="middle">删除</Button>
            </Space>
          ),
        },
      ]

    const formStyle = {
        maxWidth: 'none',
        padding: 24,
      };
  return (
    <Tabs defaultActiveKey="产品">
      <TabPane tab="产品信息" key="tab1">    

        <Form style={formStyle}>
            <Row gutter={16}>
                <Col span={12}>
                <Form.Item 
                    label="产品名称" 
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                    <Input  value= {editItem.productname} disabled/>
                </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label="产品型号">
                    <Input value={editItem.productmodel} disabled />
                </Form.Item>
                </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="芯片型号">
            <Input value={editItem.chipmodel} disabled />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="是否加密">
                <Radio defaultChecked={editItem.isencryp == "yes" ? true:false} disabled >
                    是
                </Radio>
                <Radio defaultChecked={editItem.isencryp == "no" ? true:false} disabled>
                    否
                </Radio>
            </Form.Item>
            </Col>
        </Row>

        <ProductkeyItem  prodkeyText={editItem.productkey} />

        </Form>

      </TabPane>
      <TabPane tab="许可证" key="tab2">
        <PermitTable columns={columns}  editItem={editItem}/>
      </TabPane>
      <TabPane tab="设备" key="tab3">
        <PermitDevice editItem={editItem}/>
      </TabPane>
    </Tabs>
  );
};

export default ProdPermit;
