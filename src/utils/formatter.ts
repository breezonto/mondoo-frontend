import { marked } from 'marked';


/**
 * 
 * @TODO 对于formatMsgTime，formatDateTime，formatRelativeTime，formatMessageContent
 * 等多个格式化输出时间字符串的函数，统一一下规范和标准
 * 
 */


// 时间格式化
export const formatMsgTime = (dateVal: any): string => {
  if (dateVal == null) return '';
  let d: Date;
  if (Array.isArray(dateVal)) {
    d = new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3] || 0, dateVal[4] || 0, dateVal[5] || 0);
  } else if (typeof dateVal === 'number') {
    d = new Date(dateVal);
  } else if (typeof dateVal === 'string') {
    const s = dateVal.replace(/T/, ' ').replace(/\.\d+/, '').replace(/Z$/, '');
    d = new Date(s);
    if (isNaN(d.getTime())) {
      d = new Date(s.replace(/-/g, '/'));
    }
  } else {
    d = new Date(dateVal);
  }
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (d.toDateString() === now.toDateString()) return time;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `昨天 ${time}`;
  if (d.getFullYear() === now.getFullYear()) return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${time}`;
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${time}`;
};


// 格式化日期时间
export const formatDateTime = (dateTime: any): string => {
  // 确保dateTime是一个有效的字符串
  if (!dateTime || typeof dateTime !== 'string') return '-';
  const date = new Date(dateTime);
  // 检查日期是否有效
  if (isNaN(date.getTime())) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


// 格式化时间为相对时间或绝对时间
export const formatRelativeTime = (dateTime: any): string => {
  if (!dateTime || typeof dateTime !== 'string') return '';
  
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // 小于1分钟：显示“刚刚”
  if (diffSeconds < 60) {
    return '刚刚';
  }
  // 小于1小时：显示“X分钟前”
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  // 小于24小时：显示“X小时前”
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  // 小于7天：显示“X天前”
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  // 超过7天：显示具体日期 MM-DD
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
};


export const formatMessageContent = async (
    content    : string,
    fileLinks? : Array<{text: string; fileId: string; fileName: string; ext?: string}>
  )
: Promise<string> => {
    let processed = content;
    // 统一替换《...》：有 fileLinks 时可点击，无时仅样式占位（消除延迟变形）
    processed = processed.replace(/《([^》]{1,80})》/g, (_, name) => {
      if (fileLinks && fileLinks.length > 0) {
        for (const link of fileLinks) {
          if (name.includes(link.fileName) || link.fileName.includes(name)) {
            const displayName = link.fileName + (link.ext ? '.' + link.ext : '');
            return `<a class="inline-fl" href="#" data-fid="${link.fileId}" data-fname="${link.fileName}">${displayName}</a>`;
          }
        }
      }
      return `<span class="inline-fl-pending">${name}</span>`;
    });
    const cleanedContent = processed.replace(/^[#*]+/g, ' ');
    return await marked.parse(cleanedContent);
};


export const formatFileSize = (size: any): string => {
  // 确保size是一个有效的数字
  const numSize = Number(size);
  if (isNaN(numSize) || numSize < 0) return '-';
  if (numSize < 1024) return `${numSize}B`;
  if (numSize < 1024 * 1024) return `${(numSize / 1024).toFixed(2)}KB`;
  if (numSize < 1024 * 1024 * 1024) return `${(numSize / (1024 * 1024)).toFixed(2)}MB`;
  return `${(numSize / (1024 * 1024 * 1024)).toFixed(2)}GB`;
};