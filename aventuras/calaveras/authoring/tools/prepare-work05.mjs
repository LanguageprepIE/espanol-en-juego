// Technical asset preparation: crop the existing transparent padding, resize,
// pack equal cells with a common anchor, and encode WebP. No recoloring.
import {createRequire} from 'node:module';
const req=createRequire(import.meta.url);let sharp;try{sharp=req('sharp')}catch{sharp=createRequire((process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules')+'/../package.json')('sharp')}
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
const root=new URL('../',import.meta.url).pathname;
await mkdir(root+'assets/work05',{recursive:true});
function bounds(data,width,height,threshold=40){let left=width,top=height,right=0,bottom=0;for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>threshold){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}if(left===width)throw new Error('Empty transparent asset');return{left,top,width:right-left+1,height:bottom-top+1};}
const files=[];
for(const name of ['school','plaza']){
 const source=root+'assets/source-work05/'+name+'.png',raw=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const b=bounds(raw.data,raw.info.width,raw.info.height,40),top=Math.max(0,b.top-35),bottom=Math.min(raw.info.height,b.top+b.height+20);
 const path='assets/work05/'+name+'.webp';
 await sharp(source).extract({left:0,top,width:raw.info.width,height:bottom-top}).resize(1536,684,{fit:'contain',background:'#00000000'}).webp({quality:85,alphaQuality:95,effort:6}).toFile(root+path);
 files.push({name,path,bytes:(await stat(root+path)).size,width:1536,height:684,alpha:true});
}
const source=root+'assets/source-work05/props.png',meta=await sharp(source).metadata(),sw=meta.width/3,sh=meta.height/2,tiles=[];
for(let i=0;i<6;i++){
 const cell=await sharp(source).extract({left:i%3*sw,top:Math.floor(i/3)*sh,width:sw,height:sh}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const b=bounds(cell.data,sw,sh,40),sprite=await sharp(cell.data,{raw:cell.info}).extract(b).resize(218,218,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
 tiles.push({input:sprite.data,left:i%3*256+Math.floor((256-sprite.info.width)/2),top:Math.floor(i/3)*256+236-sprite.info.height});
}
const path='assets/work05/props.webp';await sharp({create:{width:768,height:512,channels:4,background:'#00000000'}}).composite(tiles).webp({quality:88,alphaQuality:100,effort:6}).toFile(root+path);
files.push({name:'props',path,bytes:(await stat(root+path)).size,width:768,height:512,alpha:true});
const packed=await sharp(root+path).ensureAlpha().raw().toBuffer({resolveWithObject:true}),frames=[];
for(let i=0;i<6;i++){const tile=await sharp(packed.data,{raw:packed.info}).extract({left:i%3*256,top:Math.floor(i/3)*256,width:256,height:256}).raw().toBuffer();const b=bounds(tile,256,256,0);frames.push({frame:i,bounds:{x:b.left,y:b.top,w:b.width,h:b.height}});}
const atlas={cols:3,rows:2,cell:256,anchor:{x:128,y:236},frames};
const runtimeBytes=files.reduce((sum,f)=>sum+f.bytes,0),sourceBytes=(await Promise.all(['school','plaza','props'].map(async name=>(await stat(root+'assets/source-work05/'+name+'.png')).size))).reduce((a,b)=>a+b,0);
await writeFile(root+'assets/work05/manifest.json',JSON.stringify({work:5,files,atlases:{props:atlas},runtimeBytes,sourceBytes},null,2));
let code=(await readFile(root+'src/art.js','utf8')).split('// Work 05 themes')[0].replace(/^export const ASSET_FILES=.*\n?/gm,'');
code+='// Work 05 themes\nART.files.push(...'+JSON.stringify(files)+');\nART.atlases.props='+JSON.stringify(atlas)+';\nART.work=5;ART.runtimeBytes+='+runtimeBytes+';ART.sourceBytes+='+sourceBytes+';\nexport const ASSET_FILES=Object.fromEntries(ART.files.map(f=>[f.name,f.path]));\n';
await writeFile(root+'src/art.js',code);console.log(JSON.stringify({files,runtimeBytes,sourceBytes}));
