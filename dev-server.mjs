import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.env.STATIC_ROOT||'dist');
const prefix=(process.env.BASE_PATH||'').replace(/\/$/,'');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
  if(prefix){if(name===prefix){res.writeHead(302,{Location:prefix+'/'});res.end();return;}if(!name.startsWith(prefix+'/')){res.writeHead(404);res.end();return;}name=name.slice(prefix.length);}
  const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  let stat;try{stat=statSync(file);if(!stat.isFile())throw new Error();}catch{res.writeHead(404);res.end('Not found');return;}
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
  let start=0,end=stat.size-1,status=200;
  if(req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!match){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
    if(match[1]===''){start=Math.max(0,stat.size-Number(match[2]));}else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
    if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
    status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
  }
  headers['Content-Length']=String(end-start+1);res.writeHead(status,headers);
  if(req.method==='HEAD'){res.end();return;}createReadStream(file,{start,end}).pipe(res);
});
server.listen(Number(process.env.PORT||4178),'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
