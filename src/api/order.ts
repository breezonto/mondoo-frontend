import request from '@/utils/request';

/**
 * 获取订单列表（分页）
 */
export function getOrderList(params: {
  page?: number;
  size?: number;
  orderNo?: string;
  startTime?: string;
  endTime?: string;
}) {
  return request({
    url: '/api/order/list',
    method: 'get',
    params
  });
}

/**
 * 查询订单详情
 */
export function getOrderDetail(orderNo: string) {
  return request({
    url: `/api/order/detail/${orderNo}`,
    method: 'get'
  });
}
