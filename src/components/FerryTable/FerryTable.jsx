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

const dataDeafaul = []
// for (let i = 0; i < 60; i++) {
//   dataDeafaul.push({
//     id:i,
//     productname: "产品"+i,
//     productmodel: 'etsme' + i,
//     chipmodel: `x86 ${i}`,
//     devicetotal: 32,
//     devicebalance:10,
//     createtime: (new Date()).toLocaleString()
//   })
// }

const FerryTable = (props, ref) => {
  const { checked, url, editItem} = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectTotalKeys, setSelectTotalKeys] = useState({})
  const [data, setData] = useState({
    count: 0,
    page: 1,
    list: []
  })
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState({
    row: 10,
    page: 1
  })


  const storeRecord = useSelector((state) => {
    return state.get("editRecord")
  }); // 从 Redux store 获取数据

  let curRecord = storeRecord.editItem


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

  const fetchData = async (record) => {
    console.log("fetch Data",record)
    setLoading(true)

    let  serverUrl = url + "/get" + `?pageSize=${query.row}&offset=${query.row*(query.page-1)}`

    if(url.includes("/permit")){
      if (!record){
        record = curRecord
      }
      console.log("fetch data permit",record)
      serverUrl = serverUrl + `&permitProdId=${record.id}`
    }

    console.log("fetchData url" ,serverUrl)
    try {
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (response.status === 401){
        notification.error({
          message: '系统通知',
          description: `未登录，或者登录已失效！`,
        });
        window.localStorage.islogin = '0'
        return
      }

      const result = await response.json();
      // const reData = JSON.parse(result)
      let reData = result

      console.log("reData",reData)
        
      setLoading(false)
      setData({
        ...query,
        count: reData.Data.count,
        list: reData.Data.list
      })
      if (selectTotalKeys[query.page]) {
        let curRow = selectTotalKeys[query.page]
        let arr = []
        reData.list.forEach((item) => {
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
    curRecord = storeRecord.editItem
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeRecord])

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


  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])



  const delRow = async (row, api) => {
    console.log("delete row",row)
    try {
      let response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:row.id})
      })
      if (response.status === 200){
        console.log("succeed to delete",response.json())
        notification.success({ message: '删除成功' })
      }else{
        notification.error({ message: '删除失败,错误编码：' + response.status})
      }

    }catch(err){
      console.log("failed to delete",err)
      notification.error({ message: '删除失败:', err })
    }
    console.log("refresh data again")
    fetchData()
  }

  useImperativeHandle(ref, () => ({
    refresh: fetchData,
    del: delRow
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

export default forwardRef(FerryTable)
