let env = {}
let url = '/api'
if (env.REACT_APP_MODE === 'test') {
  // 测试服
  url = '/api'
} else if (process.env.NODE_ENV === 'production') {
  // 正式服
  url = '/api'
} else {
  url = '/api'
}

export const baseUrl = url
