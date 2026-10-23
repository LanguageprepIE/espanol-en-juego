import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {stat,writeFile} from 'node:fs/promises';
import {ART} from '../src/art.js';
const localRequire=createRequire(import.meta.url);let sharp;try{sharp=localRequire('sharp')}catch{sharp=createRequire((process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/../package.json')('sharp')}
const root=new URL('../',import.meta.url).pathname;
const checks=[];
for(const name of ['hero','enemies','environment','characters','props']){
 const a=ART.atlases[name],file=ART.files.find(f=>f.name===name),decoded=await sharp(root+file.path).ensureAlpha().raw().toBuffer({resolveWithObject:true}),{data,info}=decoded;
 assert.equal(info.width,a.cols*a.cell);assert.equal(info.height,a.rows*a.cell);assert.equal(a.frames.length,a.cols*a.rows);
 for(const frame of a.frames){const b=frame.bounds;assert.ok(b.x>=1&&b.y>=1&&b.x+b.w<a.cell&&b.y+b.h<a.cell);assert.equal(b.y+b.h,a.anchor.y);const fx=frame.frame%a.cols*a.cell,fy=Math.floor(frame.frame/a.cols)*a.cell;let alphaPixels=0;for(let y=0;y<a.cell;y++)for(let x=0;x<a.cell;x++){const alpha=data[((fy+y)*info.width+fx+x)*4+3];if(alpha>20)alphaPixels++;if(x===0||y===0||x===a.cell-1||y===a.cell-1)assert.equal(alpha,0,`${name} ${frame.frame} clipped edge`)}assert.ok(alphaPixels>50);}
 checks.push({atlas:name,frames:a.frames.length,dimensions:[info.width,info.height],transparentPadding:true,commonFootAnchor:a.anchor});
}
for(const f of ART.files)assert.equal((await stat(root+f.path)).size,f.bytes);
let approvedVisibleChannelsChanged=null;if(ART.work>=3){const a=await sharp(root+'assets/work02/hero.webp').ensureAlpha().raw().toBuffer(),b=await sharp(root+'assets/work03/hero.webp').extract({left:0,top:0,width:768,height:512}).ensureAlpha().raw().toBuffer();approvedVisibleChannelsChanged=0;for(let i=0;i<a.length;i+=4)if(a[i+3])for(let j=0;j<4;j++)if(a[i+j]!==b[i+j])approvedVisibleChannelsChanged++;assert.equal(approvedVisibleChannelsChanged,0);}
const result={checks,approvedVisibleChannelsChanged,runtimeBytes:ART.runtimeBytes,sourceBytes:ART.sourceBytes,savingsPercent:Math.round((1-ART.runtimeBytes/ART.sourceBytes)*100)};
await writeFile(root+'qa-output/asset-report.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
