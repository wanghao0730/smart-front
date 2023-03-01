import request from '@/utils/request'

// 查询学校社团列表
export function listLeague(query) {
  return request({
    url: '/front/league/list',
    method: 'get',
    params: query
  })
}

// 查询学校社团详细
export function getLeague(id) {
  return request({
    url: '/front/league/' + id,
    method: 'get'
  })
}

// 新增学校社团
export function addLeague(data) {
  return request({
    url: '/front/league',
    method: 'post',
    data: data
  })
}

// 修改学校社团
export function updateLeague(data) {
  return request({
    url: '/front/league',
    method: 'put',
    data: data
  })
}

// 删除学校社团
export function delLeague(id) {
  return request({
    url: '/front/league/' + id,
    method: 'delete'
  })
}
