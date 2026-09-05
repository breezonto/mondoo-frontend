import request from '@/utils/request';

// 获取菜单列表（根据角色）
export function getMenuListByRole() {
  return request({
    url: '/api/menu/getMenuListByRole',
    method: 'get'
  });
}

// 获取所有菜单列表（管理员用）
export function getMenuList() {
  return request({
    url: '/api/menu/getMenuList',
    method: 'get'
  });
}

// 新增菜单
export function addMenu(menuData: any) {
  return request({
    url: '/api/menu/addMenu',
    method: 'post',
    data: menuData
  });
}

// 修改菜单
export function updateMenu(menuData: any) {
  return request({
    url: '/api/menu/updateMenu',
    method: 'put',
    data: menuData
  });
}

// 删除菜单
export function deleteMenu(id: number) {
  return request({
    url: '/api/menu/deleteMenu',
    method: 'delete',
    params: { id }
  });
}

// 批量获取所有菜单的角色分配
export function getAllMenuRoles() {
  return request({
    url: '/api/menu/allRoleMenus',
    method: 'get'
  });
}

// 获取菜单已分配的角色列表
export function getMenuRoles(menuId: number) {
  return request({
    url: '/api/menu/roleMenus',
    method: 'get',
    params: { menuId }
  });
}

// 更新菜单的角色分配
export function updateMenuRoles(menuId: number, roleCodes: string[]) {
  return request({
    url: '/api/menu/roleMenus',
    method: 'put',
    data: { menuId, roleCodes }
  });
}

// 获取角色可见的菜单ID列表
export function getMenuIdsByRole(roleCode: string) {
  return request({
    url: '/api/menu/roleMenuIds',
    method: 'get',
    params: { roleCode }
  });
}
