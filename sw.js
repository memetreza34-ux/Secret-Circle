'use strict';
const CACHE='secret-circle-v11';
const CORE=['./','./index.html','./privacy.html','./styles.css','./pwa.css','./runtime-guard.js','./app.js','./game-engine.js','./word-packs.js','./data-store.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});

async function fetchAndCache(request){
  const response=await fetch(request);
  if(response.ok){
    const cache=await caches.open(CACHE);
    await cache.put(request,response.clone());
  }
  return response;
}

async function handleNavigation(request){
  try{
    return await fetchAndCache(request);
  }catch{
    return await caches.match(request)||await caches.match('./index.html')||new Response('Offline',{status:503,statusText:'Offline'});
  }
}

async function handleAsset(request){
  const cached=await caches.match(request);
  if(cached)return cached;
  try{
    return await fetchAndCache(request);
  }catch{
    return new Response('Offline',{status:503,statusText:'Offline'});
  }
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const requestUrl=new URL(event.request.url);
  if(requestUrl.origin!==self.location.origin)return;
  event.respondWith(event.request.mode==='navigate'?handleNavigation(event.request):handleAsset(event.request));
});
