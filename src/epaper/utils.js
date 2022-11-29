export function int2Bytes(buffer, offset, value, limit) {
  for(let i = 0; i < limit; i++) {
    buffer[offset + i] = (value >>> (i * 8)) & 0xFF;
  }
}
