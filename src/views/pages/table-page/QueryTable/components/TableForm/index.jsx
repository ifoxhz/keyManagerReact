import React, { useEffect, useState ,useCallback} from 'react'
import { log } from '@ferrydjing/utils'
import { Form, Button, Input, Spin, notification,Radio, Upload,Select,message } from 'antd'
import Papa from 'papaparse';
const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}


const cvsCheck =(prodkeyText) => {
    
  const cvsKey = ['appId','model','productType','security']
  const result = Papa.parse(prodkeyText)
  // 获取键值对
  const keyValuePairs = result.data.reduce((reduceKeyPair, item) => {
      const key = item[0];
      const value = item[1];
      reduceKeyPair[key] = value;
      return reduceKeyPair;
  }, {});

  return  cvsKey.find((key) => !keyValuePairs.hasOwnProperty(key))
}


const KeyUploader = (props) => {
  const {upData,setOneFile} = props
  const [fileContent, setFileContent] = useState(null);

  const handlebeforeUpload = (file) => {
    console.log("handlebeforeUpload","读取文件",file)
    // setOneFile([file])
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log("read file end:")
        const cvsRes =  cvsCheck(e.target.result)
        if (cvsRes){
          console.log("cvs file lost:",cvsRes)
          const text = `产品密钥文件缺失参数:${cvsRes}`
          message.warning(text);
          return 
        }
        upData(e.target.result)
        Papa.parse(e.target.result, {
          header: false,
          complete: function(results) {
            console.log("papa parse over",results.data); // 处理完毕的 CSV 数据
            setFileContent(results.data)
        }
    });
    }; 
    reader.readAsText(file.originFileObj || file);
    // return false 
    return false
  }; 

  return (
    <>
      <Upload action="" maxCount={1}  multiple={false}  beforeUpload={handlebeforeUpload}>
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
  const [oneFile, setOneFile] = useState([])

  const cvsCheck =(prodkeyText) => {
    
    const cvsKey = ['appId','model','productType','security']
    const result = Papa.parse(prodkeyText)
    // 获取键值对
    const keyValuePairs = result.data.reduce((reduceKeyPair, item) => {
        const key = item[0];
        const value = item[1];
        reduceKeyPair[key] = value;
        return reduceKeyPair;
    }, {});

    console.log("keyValuePairs  pare items:")
    return  cvsKey.find((key) => !keyValuePairs.hasOwnProperty(key))
  }


  const handleSetProdKey = (key) => {
    console.log("call set form key")
    const lostKey = cvsCheck(key)
    if(lostKey){
      // const text = `产品密钥文件缺失参数:${lostKey}`
      // message.warning(text);
      return 
    }else{
      setProdKey(key);
    }
  }


  const save = async (values) => {

    console.log("save :",prodKey)
    if(!prodKey){
      const text = `产品密钥文件缺失!`
      message.warning(text);
      return 
    }

    setLoading(true)
    form.resetFields()

    values.productkey = prodKey
    setProdKey(null)
    log("create product form:",values)
    // setTimeout(() => {
    //   setLoading(false)
    //   setStatus(1)
    // }, 2000)
    fetch('/api/product/create', {
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
        <Form.Item label='芯片型号' name='chipmodel' >
          <Select>
            <Option value="HSC32I1">HSC32I1</Option>
            <Option value="DK_LX100">DK_LX100</Option>
            <Option value="WP_LX100">WP_LX100</Option>
            <Option value="ZX9660">ZX9660</Option>
            <Option value="CIU98">CIU98</Option>
            <Option value="HSC32I3">HSC32I3</Option>
          </Select>
        </Form.Item>
        <Form.Item label="是否加密" initialValue="no"  name="isencryp">
            <Radio.Group >
            <Radio value="yes" disabled>是</Radio>
            <Radio value="no">否</Radio>
          </Radio.Group>
        </Form.Item> 
        <Form.Item label='产品密钥' name='productinfo'>
          <KeyUploader setOneFile={setOneFile}  upData={handleSetProdKey} />
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
