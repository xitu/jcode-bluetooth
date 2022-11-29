export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function unhexlify(str) {
  let result = '';
  if(str.length % 2 !== 0) {
    throw new Error('The string length is not a multiple of 2');
  }
  for(let i = 0, l = str.length; i < l; i += 2) {
    const toHex = parseInt(str.substr(i, 2), 16);
    if(isNaN(toHex)) {
      throw new Error('str contains non hex character');
    }
    result += String.fromCharCode(toHex);
  }
  return result;
}


const BUFFER_SIZE = 1332;
export function stringToBuffer(message, buffer_size = BUFFER_SIZE) {
  const bufferArray = [];
  const regExp = new RegExp(`.{1,${buffer_size}}`, 'g');
  message.match(regExp).forEach((part) => {
    bufferArray.push(Buffer.from(unhexlify(part), 'binary'));
  });
  return bufferArray;
}