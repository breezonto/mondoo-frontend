import request from '@/utils/request';

// 获取表中所有数据 - 获取历史对话列表（本用户）
export function getHistoryList() {
  return request({
    url: '/api/chat/historyList',
    method: 'get'
  });
}

export function historyListAll(params?: {
  keyword?: string;
  username?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
}) {
  return request({
    url: '/api/chat/historyListAll',
    method: 'get',
    params
  });
}

// 搜索历史会话
export function searchHistory(keyword?: string) {
  return request({
    url: '/api/chat/searchHistory',
    method: 'get',
    params: keyword ? { keyword } : {}
  });
}

// 删除历史会话
export function deleteHistory(id: number) {
  return request({
    url: '/api/chat/deleteHistory',
    method: 'delete',
    params: {
      id
    }
  });
}

// 获取对话中的所有聊天记录
export function getMessageList(id: string, chatType?: string) {
  return request({
    url: '/api/chat/messageList',
    method: 'get',
    params: {
      id: id,
      chatType: chatType
    }
  });
}

// 查询所有配置
export function listAll() {
  return request({
    url: '/api/interface-config/list',
    method: 'get',
  });
}



// 保存/修改配置
export function saveConfig(interfaceConfig: any[]) {
  return request({
    url: '/api/interface-config/save',
    method: 'post',
    data: {
      interfaceConfig: interfaceConfig
    }
  });
}


export const generateChatCompletion = async (
  messageHistory : {role: string, content: string}[],
  stream         : boolean,
  context_id     : string | undefined = undefined
)
: Promise<Response> => {
  try {
    const url = context_id
      ? `/api/v1/chat/${encodeURIComponent(context_id)}/completions`
      : `/api/v1/chat/completions`;
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          model_type: 'remote',
          messages: messageHistory,
          context_id: context_id,
          options: {
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1.0,
            top_k: 50,
            repetition_penalty: 0.0,
            stop_sequences: ["\n\n"],
            stream: stream,
            chunk_size: 5,
            system_prompt: "You are a helpful assistant.",
          },
        }),
      }
    );
   
    if (!response.ok) { 
      throw new Error(`HTTP ${response.status}`);
    }

    return response;
  }
  catch (err) {
    console.error(err);
    return Response.error()
  } 
}


export const clearChatMessagesInBackend = async (
  context_id : string
) : Promise<Response> => {
  try {
    const url = `/api/v1/chat/${encodeURIComponent(context_id)}`;
    const response = await fetch(
      url,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': "application/json",
        }
      }
    );
   
    if (!response.ok) { 
      throw new Error(`HTTP ${response.status}`);
    }

    return response;
  }
  catch (err) {
    console.error(err);
    return Response.error()
  } 
}