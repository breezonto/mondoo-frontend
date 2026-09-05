

/**
 * 临时函数，生成唯一的随机数
 */
export function uuidv4() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    c =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >>
          (Number(c) / 4)
      ).toString(16)
  );
}