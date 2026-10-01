import request from '@/utils/request';


export async function uploadFileSlice(
  file          : File,
  fileId        : string,
  onProgress?   : (percent: number) => void,
  timeout_in_ms : number = 5_000
) {

  const sliceSize   = 1024 * 1024; // 1MB
  const totalSlices = Math.ceil(file.size / sliceSize);

  for (let i = 0; i < totalSlices; i++) {
    const formData = new FormData();
    const slice = file.slice(i * sliceSize, (i + 1) * sliceSize);

    formData.append('file', slice);
    formData.append('filename', file.name);
    formData.append('slice_index', String(i));
    formData.append('total_slices', String(totalSlices));

    const startTs = Date.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeout_in_ms);

    try {
      const resp = await fetch(
        `/api/v1/files/${fileId}/slices/${i}`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            'x-upload-timestamp': startTs.toString()
          },
          signal: controller.signal,
        }
      );

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      onProgress?.(data.percent);

    } finally {
      clearTimeout(timeout);
    }
  }

  return true;
}


export async function completeUploadFile(
  fileId        : string,
  meth          : string,
  timeout_in_ms : number = 5_000
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeout_in_ms);

  const parse_meth = meth;
  try {
    const resp = await fetch(`/api/v1/files/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parse_meth,
        should_cache:   true,
        should_offline: true,
        should_store:   true
      }),
      signal: AbortSignal.timeout(timeout_in_ms)
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const data = await resp.json();
    return `Upload complete! File ID: ${data.file_id}`;

  } finally {
    clearTimeout(timeout);
  }
}


export async function getFileList(timeout_in_ms: number = 5_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeout_in_ms);

  try {
    const resp = await fetch("/api/v1/files", {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      signal: controller.signal,
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const data = await resp.json();

    return data.views;

  } finally {
    clearTimeout(timeout);
  }
}


export async function deleteFile(
  fileId       : string,
  timeout_in_ms : number = 5_000
) {
  try {
    console.log("Start to Delete File:", fileId)
    const resp = await fetch(`/api/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(timeout_in_ms)
    });

    if (!resp.ok) {
      alert("Failed to delete File");
      return 'error';
    }
    const data = await resp.json();
    return data;
  }
  catch(error) {

  }
}


// 批量删除文件信息
export function batchDeleteFiles(fileIds: string[]) {
  return request({
    url: '/api/batch',
    method: 'delete',
    data: fileIds,
  });
}


// 获取文件缩略图
export function getThumbnail(fileId: string) {
  return request({
    url: '/api/getThumbnail',
    method: 'get',
    params: { fileId },
    responseType: 'blob'
  });
}


// 批量按文件名精确匹配（用于AI回复中的文件检索）
export function batchMatchFiles(names: string[]) {
  return request({
    url: '/api/fileList/match',
    method: 'post',
    data: { names }
  });
}

