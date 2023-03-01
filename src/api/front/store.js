import request from '@/utils/request'

// 查询店铺信息列表
export function listStore(query) {
  return request({
    url: '/front/store/list',
    method: 'get',
    params: query
  })
}

// 查询店铺信息详细
export function getStore(id) {
  return request({
    url: '/front/store/' + id,
    method: 'get'
  })
}

// 新增店铺信息
export function addStore(data) {
  return request({
    url: '/front/store',
    method: 'post',
    data: data
  })
}

// 修改店铺信息
export function updateStore(data) {
  return request({
    url: '/front/store',
    method: 'put',
    data: data
  })
}

// 删除店铺信息
export function delStore(id) {
  return request({
    url: '/front/store/' + id,
    method: 'delete'
  })
}
