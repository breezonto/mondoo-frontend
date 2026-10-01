import { getFileList }  from "@/api/file";


export interface FileDesc {
  file_id     : string;
  filename    : string;
  type        : string;
  size        : number;
  stage       : string;
  num_chunk   : number;
  upload_time : string;
}


export interface FileLink {
  text     : string;
  fileId   : string;
  fileName : string;
  ext?     : string;
}


export const loadFileList = async (
    _keyword?   : string,
    _startDate? : string,
    _endDate?   : string,

) => {

  var fileList : FileDesc[] = [];
  
  try {
    fileList = await getFileList();
  } catch (error) {
    throw error;
  }

  return fileList;
};