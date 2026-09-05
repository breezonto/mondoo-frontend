import { getFileList }  from "@/api/file";


export interface FileDesc {
  file_id     : string;
  filename    : string;
  type        : string;
  size        : number;
  stage       : string;
  num_chunk   : number;
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
    const keyword   = _keyword?.trim() || undefined;
    const startDate = _startDate       || undefined;
    const endDate   = _endDate         || undefined;

    // const response = await getFileList(keyword, startDate, endDate);

    fileList = await getFileList();
  } catch (error) {
    console.error('Failed to Load File List:', error);
    fileList = [];
  }

  return fileList;
};