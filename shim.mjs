export function encode_utf8(value) {
  return new TextEncoder().encode(value);
}

export function decode_utf8(value) {
  return new TextDecoder("utf-8", { fatal: false }).decode(value);
}

export function slice_from(value, start) {
  return value.slice(start);
}

export function concat_bytes(a, b) {
  const out = new Uint8Array(a.byteLength + b.byteLength);
  out.set(a, 0);
  out.set(b, a.byteLength);
  return out;
}

export function from_numbers(values) {
  return Uint8Array.from(values);
}

export function encode_hex(value) {
  let s = "";
  for (let i = 0; i < value.byteLength; i++) {
    const hex = value[i].toString(16);
    s += hex.length < 2 ? "0" + hex : hex;
  }
  return s;
}

export function from_hex_bytes(value) {
  const clean = String(value);
  if (clean.length % 2 !== 0) {
    throw new Error("invalid hex: odd length");
  }
  if (!/^[0-9a-fA-F]*$/.test(clean)) {
    throw new Error("invalid hex");
  }
  const n = clean.length / 2;
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function encode_base64(value) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let s = "";
  const n = value.byteLength;
  for (let i = 0; i < n; i += 3) {
    const b0 = value[i];
    const b1 = i + 1 < n ? value[i + 1] : 0;
    const b2 = i + 2 < n ? value[i + 2] : 0;
    const triple = (b0 << 16) + (b1 << 8) + b2;
    s += alphabet[(triple >> 18) & 63];
    s += alphabet[(triple >> 12) & 63];
    s += i + 1 < n ? alphabet[(triple >> 6) & 63] : "=";
    s += i + 2 < n ? alphabet[triple & 63] : "=";
  }
  return s;
}

export function from_base64_bytes(value) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const raw = String(value);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(raw)) {
    throw new Error("invalid base64");
  }
  const clean = raw.replace(/=+$/, "");
  const n = clean.length;
  const out = [];
  for (let i = 0; i < n; i += 4) {
    const c0 = alphabet.indexOf(clean[i]);
    const c1 = alphabet.indexOf(clean[i + 1]);
    const c2 = i + 2 < n ? alphabet.indexOf(clean[i + 2]) : 0;
    const c3 = i + 3 < n ? alphabet.indexOf(clean[i + 3]) : 0;
    if (c0 < 0 || c1 < 0 || (i + 2 < n && c2 < 0) || (i + 3 < n && c3 < 0)) {
      throw new Error("invalid base64");
    }
    const triple = (c0 << 18) + (c1 << 12) + (c2 << 6) + c3;
    out.push((triple >> 16) & 255);
    if (i + 2 < n) out.push((triple >> 8) & 255);
    if (i + 3 < n) out.push(triple & 255);
  }
  return new Uint8Array(out);
}
