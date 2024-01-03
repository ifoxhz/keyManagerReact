import React, { useEffect, useState ,useCallback} from 'react'
import { log } from '@ferrydjing/utils'
import { Form, Button, Input, Spin, notification,Radio, Upload } from 'antd'
import Papa from 'papaparse';
const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}

const KeyUploader = ({upData}) => {
  const [fileContent, setFileContent] = useState(null);

  const handlebeforeUpload = (file) => {
    console.log("handlebeforeUpload","读取文件",file)
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log("read file end:",e.target.result)
        upData(e.target.result)
        // Papa.parse(reader, {
        //   complete: function(results) {
        //     console.log("papa parse over",results.data); // 处理完毕的 CSV 数据
        //     setFileContent(results.data)
        //   }
        // });
    }; 
    reader.readAsText(file.originFileObj || file);
    // return false 
    Papa.parse(file.originFileObj || file, {
          header: false,
          complete: function(results) {
            console.log("papa parse over",results.data); // 处理完毕的 CSV 数据
            setFileContent(results.data)
          }
        });
    return false
  }; 

  return (
    <>
      <Upload action=""  multiple={false}  beforeUpload={handlebeforeUpload}>
        <Button>选择文件</Button>
      </Upload>

      {fileContent && (
        <ProductInfo text={fileContent} />
      )}
    </>
  );
};

function ProductInfo({text} ){

return (

     <Form.Item label={"密钥详情"} name="productkeyinfo" >
     <TextArea id='productkeyarea' 
          maxLength={65535} 
          placeholder={text} value={text}
          autoSize={{ minRows: 2, maxRows: 6, minHeight: 100, maxHeight: 300 }} />
     </Form.Item>

 
  )
}


function ProductkeyForm ({items}) {


  return (
    <div>
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
    </div>
  )
    
}




const TableForm = (props) => {
  const { onCancel, onConfirm } = props
  const [loading, setLoading] = useState(false)
  const [status,  setStatus] = useState(0)
  const [prodKey, setProdKey] = useState(null)
  const [form] = Form.useForm()
  // const formRef = useRef(null);


  const handleSetProdKey = (key) => {
    console.log("call set form key",key)
    setProdKey(key);
  }


  const save = async (values) => {
    setLoading(true)
    values.productkey=prodKey
    log("create product form:",values)
    // setTimeout(() => {
    //   setLoading(false)
    //   setStatus(1)
    // }, 2000)
    fetch('/server/product/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
     })
      .then( (response) =>{
        console.log(response.status)
        console.log(response)
        if (response.status === 401){
          notification.error({
            message: '系统通知',
            description: `未登录，或者登录已失效！`,
          });
          window.localStorage.islogin = '0'
          return
        }

        if (response.status === 200) {
          setStatus(1)
        } else {
          notification.error({
            message: '产品通知',
            description: `创建产品失败，请检查输入的产品参数:`,
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
          message: '产品通知',
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

  return (
    <Spin tip='加载中' spinning={loading}>
      <Form {...layout} form={form} onFinish={save} >
        <Form.Item label='产品名称' name='productname' rules={rules.name}>
          <Input />
        </Form.Item>
        <Form.Item label='产品型号' name='productmodel' rules={rules.name}>
          <Input />
        </Form.Item>
        <Form.Item label='芯片型号' name='chipmodel' rules={rules.name}>
          <Input />
        </Form.Item>
        <Form.Item label="是否加密" initialValue="no"  name="isencryp">
            <Radio.Group >
            <Radio value="yes">是</Radio>
            <Radio value="no">否</Radio>
          </Radio.Group>
        </Form.Item> 
        <Form.Item label='产品密钥' name='productinfo'>
          <KeyUploader  upData={handleSetProdKey} />
        </Form.Item>
        <Form.Item name="productkey" >
          {/* <Input  value={prodKey}  disabled /> */}
        </Form.Item>
        {/* <Form.Item label='设备总量' name='devicetotal' rules={rules.count}>
          <Input />
        </Form.Item> */}
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
