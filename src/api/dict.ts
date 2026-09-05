import request from '@/utils/request';

// 根据字典类型和编码获取字典值
export function getDictValue(dictType: string, dictCode: number) {
  return request({
    url: '/api/dict/value',
    method: 'get',
    params: {
      dictType,
      dictCode
    }
  });
}

// 根据字典类型获取完整字典（键值对）
export function getDictList(dictType: string) {
  return request({
    url: '/api/dict/list',
    method: 'get',
    params: {
      dictType
    }
  });
}
