/* Minimal PNG writer: RGBA scanlines, zlib, CRC. Enough to look at frames. */
const zlib=require('zlib'), fs=require('fs');
const CRC=new Int32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; CRC[n]=c; }
function crc(b){ let c=-1; for(const x of b) c=CRC[(c^x)&255]^(c>>>8); return (c^-1)>>>0; }
function chunk(type,data){ const t=Buffer.from(type), len=Buffer.alloc(4), cr=Buffer.alloc(4);
  len.writeUInt32BE(data.length); cr.writeUInt32BE(crc(Buffer.concat([t,data]))); return Buffer.concat([len,t,data,cr]); }
/* px: Uint32Array ABGR (little-endian RGBA bytes), w,h; scale sx,sy nearest */
function writePNG(path,px,w,h,sx=1,sy=sx,bg=null){
  const W=Math.round(w*sx), H=Math.round(h*sy), raw=Buffer.alloc((W*4+1)*H);
  for(let y=0;y<H;y++){ raw[y*(W*4+1)]=0; const vy=Math.min(h-1,(y/sy)|0);
    for(let x=0;x<W;x++){ let c=px[vy*w+Math.min(w-1,(x/sx)|0)]; const o=y*(W*4+1)+1+x*4;
      let a=(c>>>24)&255; if(a===254) a=255;
      if(bg!==null&&a===0){ c=bg; a=255; }
      raw[o]=c&255; raw[o+1]=(c>>8)&255; raw[o+2]=(c>>16)&255; raw[o+3]=a; } }
  const ihdr=Buffer.alloc(13); ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4); ihdr[8]=8; ihdr[9]=6;
  fs.writeFileSync(path,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),
    chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]));
}
module.exports={writePNG};
