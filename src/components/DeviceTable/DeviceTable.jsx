/**
 * @desc 对antd table进行二次封装
 * @props
 *    @checked    是否可选
 *    @url        接口请求地址
 *    @columns    列
 */

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react'
import { log } from '@ferrydjing/utils'
import { Table, Button, notification } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'
import * as styled from './styled'
import * as http from '@/api'
import { stringify } from 'qs'
import { useSelector} from 'react-redux'


const dataDeafaul =[]

const DeviceTable = (props, ref) => {
  const { checked, url} = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectTotalKeys, setSelectTotalKeys] = useState({})
  const [data, setData] = useState({
    count: 0,
    page: 1,
    list: []
  })
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState({
    row: 50,
    page: 1
  })

  const [curPermit, setCurPermit] = useState(null)
  const [lastOptions, setLastOptions] = useState(null)

  // const  curProduct = useSelector((state) => {
  //   return state.get("editRecord")
  // }); // 从 Redux store 获取数据


const columns = [
  {
    title: '设备号',
    dataIndex: 'cid'
  },
  {
    title: '许可证名称',
    // dataIndex:'permitname',
    key:'colpermitname',
    render: (_,record) => {
      if (record.hasOwnProperty("permitname")){
        return (record.permitname)
      }else{
        return (curPermit)}
      }
  },
  {
    title: '状态',
    render: (text, record) => {
      return (record.usedflag ? "已下载":"未下载" )
    }
  },
  {
    title: '异常描述',
    dataIndex: 'baklabel'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    render: (date) => {return (new Date(date)).toLocaleString('zh-CN')}
  },
  {
    title: '最近操作时间',
    dataIndex: 'updatedAt',
    render: (date) => {return (new Date(date)).toLocaleString('zh-CN')}
  },
]

  const onSelectChange = (currSelectedRowKeys, selectedRow) => {
    if (
      currSelectedRowKeys.length > query.row ||
      data.list.length > query.row
    ) {
      setSelectedRowKeys(currSelectedRowKeys)
    } else {
      setSelectTotalKeys({
        ...selectTotalKeys,
        [query.page]: currSelectedRowKeys
      })
    }
    // setSelectedRowKeys(currSelectedRowKeys)
  }

  const rowSelection = checked
    ? {
        selectedRowKeys,
        onChange: onSelectChange
      }
    : null

  const showTotal = (total) => `总共${total}项`

  const fetchData = async (options) => {


    console.log("DeviceTable fetch Data",options)
    if(!options){
      console.log("DeviceTable return ")
      setLoading(false)
      return 
    }
    setLoading(true)
    setCurPermit(options.permitname)
    setLastOptions(options)

    let  serverUrl = url + "/get" + `?pageSize=${query.row}&offset=${query.row*(query.page-1)}`

    serverUrl += `&permitProdId=${options.permitProdId}`
    serverUrl += options.permitname ? `&permitname=${options.permitname}`:""
    
    serverUrl += options.cid ? `&cid=${options.cid}`:""

    // serverUrl += options.usedflag ? `&usedflag=${options.usedflag}`:""

    if(options.usedflag !== undefined ){
      serverUrl += `&usedflag=${options.usedflag}`
    }

    serverUrl += options.productionline ? `&productionline=${options.productionline}`:""

    console.log("DeviceTable fetchData url is" ,serverUrl)
    try {
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const result = await response.json();
      // const reData = JSON.parse(result)

      console.log("reData",result.Data)
        
      setLoading(false)
      setData({
        ...query,
        count: result.Data.count,
        list: result.Data.list
      })
      if (selectTotalKeys[query.page]) {
        let curRow = selectTotalKeys[query.page]
        let arr = []
        result.list.forEach((item) => {
          if (curRow.indexOf(item.id) !== -1) {
            arr.push(item.id)
          }
        })
        setSelectTotalKeys({
          ...selectTotalKeys,
          [query.page]: [...arr]
        })
    }
  } catch (error) {
      setLoading(false)
      setData({
        ...query,
        count: dataDeafaul.length,
        list: dataDeafaul
      })
    }
  }

  const onTableChange = (pagination, filters, sorter, extra) => {
    log(pagination, filters, sorter, extra)
    let obj = {}
    if (extra.action === 'paginate') {
      obj = {
        page: pagination.current,
        row: pagination.pageSize
      }
      setQuery(obj)
    }
  }

  useEffect(() => {
    fetchData(lastOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    let arr = []
    for (let i in selectTotalKeys) {
      for (let j = 0; j < selectTotalKeys[i].length; j++) {
        arr.push(selectTotalKeys[i][j])
      }
    }
    setSelectedRowKeys(arr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectTotalKeys])

  const cleanTableSource = () =>{
    setData({
      count: 0,
      page: 1,
      list: []
    })
  }
  // const delRow = async (row, api) => {
  //   console.log("delete row",row)
  //   try {
  //     let response = await fetch(api, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({id:row.id})
  //     })
  //     if (response.status === 200){
  //       console.log("succeed to delete",response.json())
  //       notification.success({ message: '删除成功' })
  //     }else{
  //       notification.error({ message: '删除失败,错误编码：' + response.status})
  //     }

  //   }catch(err){
  //     console.log("failed to delete",err)
  //     notification.error({ message: '删除失败:', err })
  //   }
  //   console.log("refresh data again")
  //   fetchData()
  // }

  useImperativeHandle(ref, () => ({
    refresh: fetchData,
    cleanDataSource: cleanTableSource
  }))

  return (
    <styled.Wrap>
      {/*{checked ? (
        <div className='selection'>
          <InfoCircleFilled />
          已选择<span className='select-item'>{selectedRowKeys.length}</span>项
          <Button
            type='link'
            onClick={() => {
              setSelectedRowKeys([])
            }}
          >
            清空
          </Button>
        </div>
      ) : null}*/}
      <Table
        /*{rowSelection={rowSelection}}*/
        {...props}
        columns={columns}
        loading={loading}
        dataSource={data.list}
        rowKey={(row) => row.id || row._id || row.key}
        onChange={onTableChange}
        scroll={{
          x: true,
          y: true,
          scrollToFirstRowOnChange: true
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current: query.page,
          pageSize: query.row,
          total: data.count,
          showTotal
        }}
      />
    </styled.Wrap>
  )
}

export default forwardRef(DeviceTable)
