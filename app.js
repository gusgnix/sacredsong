'use strict';
const $=id=>document.getElementById(id), key='sacred-music-reader-20261102';
let book,page=1,busy=false,pending=null,restore=1,authenticated=false;
const loadedPages=new Map(),decryptedPages=new Map();
let readerConfig=null,readerKey=null;
try{restore=Number(localStorage.getItem(key))||1}catch{}
const image=n=>decryptedPages.get(n);
const narrow=()=>innerWidth<900;
const directoryStart=()=>book?.toc.find(item=>/目录/.test(item.title))?.page||9;
const musicStart=()=>book?.toc.find(item=>item.title==='通用节庆与圣周礼仪')?.page||19;
const pairStart=n=>n>=musicStart()?musicStart():directoryStart();
const rightOnly=n=>n<directoryStart();
const isCover=n=>n===1||n===book.pages;
const singleAt=n=>rightOnly(n)||isCover(n);
const single=()=>singleAt(page);
function pagesAt(n,isSingle){if(isSingle||n<directoryStart())return[n];const start=pairStart(n),l=start+Math.floor((n-start)/2)*2;return[l,l+1].filter(p=>p<book.pages)}
function normalize(n){n=Math.max(1,Math.min(book.pages,Number(n)||1));const start=pairStart(n);return singleAt(n)?n:start+Math.floor((n-start)/2)*2}
const printedLabels=["封面","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","甲111","甲112","甲113","甲114","甲115","甲116","甲117","甲118","甲119","甲120","甲121","甲122","甲123","甲124","甲125","甲126","甲127","甲128","甲129","甲130","甲131","甲132","甲133","甲134","甲135","甲136","甲137","甲138","甲139","甲140","甲141","甲142","甲143","甲144","甲145","甲146","甲147","甲148","甲149","甲150","甲151","甲152","甲153","甲154","甲155","甲156","甲157","甲158","甲159","甲160","甲161","甲162","甲163","甲164","甲165","甲166","甲167","甲168","甲169","甲170","甲171","甲172","甲173","甲174","甲175","甲176","甲177","甲178","甲179","甲180","甲181","甲182","甲183","甲184","甲185","甲186","甲187","甲188","甲189","甲190","甲191","甲192","甲193","甲194","甲195","甲196","甲197","甲198","甲199","甲200","甲201","甲202","甲203","甲204","甲205","甲206","甲207","甲208","甲209","甲210","甲211","甲212","甲213","甲214","甲215","甲216","乙217","乙218","乙219","乙220","乙221","乙222","乙223","乙224","乙225","乙226","乙227","乙228","乙229","乙230","乙231","乙232","乙233","乙234","乙235","乙236","乙237","乙238","乙239","乙240","乙241","乙242","乙243","乙244","乙245","乙246","乙247","乙248","乙249","乙250","乙251","乙252","乙253","乙254","乙255","乙256","乙257","乙258","乙259","乙260","乙261","乙262","乙263","乙264","乙265","乙266","乙267","乙268","乙269","乙270","乙271","乙272","乙273","乙274","乙275","乙276","乙277","乙278","乙279","乙280","乙281","乙282","乙283","乙284","乙285","乙286","乙287","乙288","乙289","乙290","乙291","乙292","乙293","乙294","乙295","乙296","乙297","乙298","乙299","乙300","乙301","乙302","乙303","乙304","乙305","乙306","乙307","乙308","乙309","乙310","乙311","乙312","乙313","乙314","乙315","乙316","乙317","乙318","乙319","乙320","乙321","乙322","乙323","乙324","乙325","乙326","乙327","乙328","丙329","丙330","丙331","丙332","丙333","丙334","丙335","丙336","丙337","丙338","丙339","丙340","丙341","丙342","丙343","丙344","丙345","丙346","丙347","丙348","丙349","丙350","丙351","丙352","丙353","丙354","丙355","丙356","丙357","丙358","丙359","丙360","丙361","丙362","丙363","丙364","丙365","丙366","丙367","丙368","丙369","丙370","丙371","丙372","丙373","丙374","丙375","丙376","丙377","丙378","丙379","丙380","丙381","丙382","丙383","丙384","丙385","丙386","丙387","丙388","丙389","丙390","丙391","丙392","丙393","丙394","丙395","丙396","丙397","丙398","丙399","丙400","丙401","丙402","丙403","丙404","丙405","丙406","丙407","丙408","丙409","丙410","丙411","丙412","丙413","丙414","丙415","丙416","丙417","丙418","丙419","丙420","丙421","丙422","丙423","丙424","丙425","丙426","丙427","丙428","丙429","丙430","丙431","丙432","丙433","丙434","丙435","丙436","丙437","丙438","丙439","丙440","版权页","空白页","封底"];
const printedLabel=n=>printedLabels[n-1]||String(n);
const printedTotal=440;
function jumpToPrinted(value){
  const query=String(value).trim();
  let index=printedLabels.findIndex(label=>label.toLowerCase()===query.toLowerCase());
  if(index<0&&/^\d+$/.test(query))index=printedLabels.findIndex(label=>label.replace(/^[甲乙丙]/,'')===String(Number(query)));
  if(index<0){notice('请输入书内页码（1–440），前置页可输入罗马数字');return}
  go(index+1);
}
function makeImage(n){const img=new Image();img.src=image(n);img.alt=`合订本第 ${n} 页`;img.draggable=false;img.decoding='async';return img}
function paper(n){const el=document.createElement('div');el.className='paper';el.append(makeImage(n));for(const l of book.links[String(n)]||[]){const a=document.createElement('a');a.className='hotspot';a.href=location.pathname;a.style.cssText=`left:${l.x}%;top:${l.y}%;width:${l.w}%;height:${l.h}%`;a.title=`跳转到第 ${printedLabel(l.page)} 页`;a.setAttribute('aria-label',a.title);a.onclick=e=>{e.preventDefault();go(l.page)};el.append(a)}return el}
function render(n){const pages=pagesAt(n,singleAt(n)).map(paper);const solo=rightOnly(n)&&!isCover(n);if(pages.length===1&&!isCover(n)){const blank=document.createElement('div');blank.className='paper blank';blank.setAttribute('aria-hidden','true');if(solo)pages.unshift(blank);else pages.push(blank)}$('spread').replaceChildren(...pages);$('book').classList.toggle('single',isCover(n));$('book').classList.toggle('solo-spread',solo);fit()}
function fit(){const area=$('readingArea'),ratio=isCover(page)?1/Math.SQRT2:Math.SQRT2;const h=Math.min(area.clientHeight,area.clientWidth/ratio);$('book').style.height=`${h}px`; $('book').style.width=`${h*ratio}px`}
function update(){const ps=pagesAt(page,single());$('pageInput').value=printedLabel(page).replace(/^[甲乙丙]/,'');$('progress').value=page;$('prev').disabled=page===1;$('next').disabled=ps.at(-1)>=book.pages;try{localStorage.setItem(key,String(page))}catch{}history.replaceState(null,'',location.pathname+location.search);for(const b of $('tocItems').querySelectorAll('button'))b.classList.toggle('active',Number(b.dataset.page)===page)}
async function decryptAsset(path){
  const url=new URL(path,document.baseURI);url.searchParams.set('v',readerConfig.version);
  const response=await fetch(url,{cache:'force-cache'});
  if(!response.ok)throw new Error('书籍文件暂时无法读取，请稍后重试。');
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(new TextDecoder().decode(bytes.slice(0,4))!=='SAC1')throw new Error('书籍文件格式不正确。');
  return crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(4,16),additionalData:new TextEncoder().encode(path)},readerKey,bytes.slice(16));
}
async function unlockBook(password){
  if(!crypto.subtle)throw new Error('请通过 HTTPS 或本地预览地址打开。');
  const response=await fetch('reader-config.json',{cache:'no-cache'});
  if(!response.ok)throw new Error('暂时无法打开书籍，请刷新重试。');
  readerConfig=await response.json();
  const salt=Uint8Array.from(atob(readerConfig.salt),ch=>ch.charCodeAt(0));
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  readerKey=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:readerConfig.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  try{return JSON.parse(new TextDecoder().decode(await decryptAsset(readerConfig.manifest)))}
  catch(error){readerKey=null;if(error.name==='OperationError')throw new Error('密码不正确，请重新输入。');throw error}
}
function loadPage(n){
  if(loadedPages.has(n))return loadedPages.get(n);
  const promise=(async()=>{
    const path=readerConfig.pages+String(n).padStart(3,'0')+'.sac';
    const plain=await decryptAsset(path);
    const url=URL.createObjectURL(new Blob([plain],{type:'image/webp'}));
    try{
      await new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=resolve;img.onerror=()=>reject(new Error('书页暂时无法打开'));img.src=url});
      decryptedPages.set(n,url);
    }catch(error){URL.revokeObjectURL(url);throw error}
  })();
  loadedPages.set(n,promise);promise.catch(()=>loadedPages.delete(n));return promise;
}
async function loadWholeBook(){
  const total=book.pages;let next=1;
  const worker=async()=>{
    while(next<=total&&authenticated){
      while(busy)await new Promise(resolve=>setTimeout(resolve,80));
      const n=next++;
      try{await loadPage(n)}catch(error){console.warn(`第 ${n} 页将在翻阅时重试`)}
    }
  };
  await Promise.all(Array.from({length:3},worker));
}

async function preload(ns){await Promise.all(ns.map(loadPage))}
async function animateCoverChange(old,n){
  const area=$('readingArea'),frame=$('book'),areaRect=area.getBoundingClientRect();
  const relative=rect=>({x:rect.left-areaRect.left,y:rect.top-areaRect.top,w:rect.width,h:rect.height});
  const origin=relative(frame.getBoundingClientRect()),oldSlots=[...$('spread').children].map(slot=>slot.cloneNode(true));
  const opening=isCover(old),frontCover=(opening?old:n)===1;
  const previousVisibility=frame.style.visibility;frame.style.visibility='hidden';
  page=n;render(n);
  const target=relative(frame.getBoundingClientRect()),newSlots=[...$('spread').children];
  const opened=opening?target:origin,closed=opening?origin:target,half=opened.w/2,scale=closed.w/half;
  const scene=document.createElement('div');scene.className='jacket-scene';scene.setAttribute('aria-hidden','true');
  Object.assign(scene.style,{width:`${opened.w}px`,height:`${opened.h}px`});
  const copyImage=(container,slot)=>{const img=slot?.querySelector('img');if(img)container.append(img.cloneNode(true))};
  const fixed=document.createElement('div');fixed.className='jacket-fixed';fixed.style.left=frontCover?'50%':'0';
  copyImage(fixed,(opening?newSlots:oldSlots)[frontCover?1:0]);
  const flap=document.createElement('div');flap.className='jacket-flap';
  const outer=document.createElement('div'),inner=document.createElement('div');outer.className='jacket-face';inner.className='jacket-face jacket-reverse';
  if(opening){outer.append(makeImage(old));copyImage(inner,newSlots[frontCover?0:1])}
  else{copyImage(outer,oldSlots[frontCover?0:1]);inner.append(makeImage(n))}
  const shadeFront=document.createElement('span'),shadeBack=document.createElement('span');shadeFront.className=shadeBack.className='jacket-shade';
  outer.append(shadeFront);inner.append(shadeBack);flap.append(outer,inner);
  const leftHinge=opening?frontCover:!frontCover;
  flap.style.left=leftHinge?'50%':'0';flap.style.transformOrigin=leftHinge?'left center':'right center';
  const angle=leftHinge?-180:180;
  const spine=document.createElement('div');spine.className='jacket-spine';
  scene.append(fixed,spine,flap);area.append(scene);
  const closedTransform=`translate3d(${closed.x-(frontCover?half*scale:0)}px,${closed.y}px,0) scale(${scale})`;
  const openedTransform=`translate3d(${opened.x}px,${opened.y}px,0) scale(1)`;
  const from=opening?closedTransform:openedTransform,to=opening?openedTransform:closedTransform;
  scene.style.transform=from;
  const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?320:opening?1060:940;
  const options={duration,easing:'cubic-bezier(.28,.12,.2,1)',fill:'both'};
  const animations=[
    scene.animate([{transform:from},{transform:to}],options),
    flap.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${angle*.88}deg)`,offset:.8},{transform:`rotateY(${angle}deg)`}],options),
    spine.animate([{opacity:opening?0:1},{opacity:opening?1:0}],options),
    ...[shadeFront,shadeBack].map(shade=>shade.animate([{opacity:0},{opacity:.22,offset:.47},{opacity:0}],options))
  ];
  try{
    await Promise.race([Promise.all(animations.map(animation=>animation.finished.catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,duration+350))]);
    render(n);frame.style.visibility=previousVisibility;
    await Promise.race([new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))),new Promise(resolve=>setTimeout(resolve,90))]);
    const handoff=scene.animate([{opacity:1},{opacity:0}],{duration:100,easing:'ease-out',fill:'both'});animations.push(handoff);
    await handoff.finished.catch(()=>{});
  }finally{
    frame.style.visibility=previousVisibility;scene.remove();animations.forEach(animation=>animation.cancel());render(n);
  }
}

async function animatePageChange(old,n){
  const spread=$('spread'),oldSlots=[...spread.children].map(slot=>slot.cloneNode(true));
  const forward=n>old,leaf=$('leaf');
  page=n;render(n);
  const newSlots=[...spread.children];
  const fillFace=(face,slot)=>face.replaceChildren(...[...(slot?.children||[])].filter(node=>node.tagName==='IMG').map(node=>node.cloneNode(true)));
  leaf.className=`leaf motion-active${forward?'':' backward'}`;
  fillFace(leaf.querySelector('.front'),oldSlots[forward?1:0]);
  fillFace(leaf.querySelector('.back'),newSlots[forward?0:1]);
  const preserved=oldSlots[forward?0:1];
  if(preserved)spread.replaceChild(preserved,forward?spread.firstChild:spread.lastChild);
  const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?300:720;
  const motion=leaf.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${forward?-180:180}deg)`}],{duration,easing:'cubic-bezier(.35,.02,.3,1)',fill:'both'});
  const shades=[...leaf.querySelectorAll('.face')].map(face=>face.animate([{filter:'brightness(1)'},{filter:'brightness(.93)',offset:.5},{filter:'brightness(1)'}],{duration,fill:'both'}));
  try{
    await Promise.race([motion.finished.catch(()=>{}),new Promise(resolve=>setTimeout(resolve,duration+300))]);
    render(n);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  }finally{leaf.className='leaf';motion.cancel();shades.forEach(shade=>shade.cancel())}
}
async function go(n,animate=true){
  if(!book)return;if(busy){pending=[n,animate];return}
  n=normalize(n);if(n===page)return;busy=true;
  try{
    const old=page;await preload(pagesAt(n,singleAt(n)));
    if(animate&&isCover(old)!==isCover(n))await animateCoverChange(old,n);
    else if(animate&&!isCover(old)&&!isCover(n))await animatePageChange(old,n);
    else{page=n;render(n)}
    update();
  }catch(error){console.error(error);notice('页面加载失败，请检查网络后重试')}
  finally{busy=false;if(pending){const next=pending;pending=null;go(...next)}}
}

function step(direction){const ps=pagesAt(page,single());go(direction>0?ps.at(-1)+1:page-1)}
function toggleToc(open){$('toc').classList.toggle('open',open);$('toc').inert=!open;$('shade').hidden=!open;$('menu').setAttribute('aria-expanded',String(open));if(open)$('search').focus();else $('menu').focus()}
function normalizeSearchNumbers(text){
  const digits={'零':0,'〇':0,'一':1,'二':2,'两':2,'兩':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
  const units={'十':10,'百':100,'千':1000,'万':10000,'萬':10000,'亿':100000000,'億':100000000};
  return String(text).toLowerCase().replace(/[０-９]/g,char=>String.fromCharCode(char.charCodeAt(0)-0xfee0))
    .replace(/[零〇一二两兩三四五六七八九十百千万萬亿億]+/g,token=>{
      if(!/[十百千万萬亿億]/.test(token))return [...token].map(char=>digits[char]).join('');
      let total=0,section=0,number=0;
      for(const char of token){
        if(Object.hasOwn(digits,char)){number=digits[char];continue}
        const unit=units[char];
        if(unit<10000)section+=(number||1)*unit;
        else if(unit===10000){total+=(section+number)*unit;section=0}
        else{total=(total+section+number)*unit;section=0}
        number=0;
      }
      return String(total+section+number);
    }).replace(/\d+/g,number=>String(Number(number)));
}
function matchesTocSearch(title,query){
  const value=query.trim().toLowerCase();
  return title.toLowerCase().includes(value)||normalizeSearchNumbers(title).includes(normalizeSearchNumbers(value));
}
function renderToc(query=''){const frag=document.createDocumentFragment();for(const item of book.toc){if(!matchesTocSearch(item.title,query))continue;const btn=document.createElement('button');btn.dataset.page=item.page;if(item.depth===0)btn.classList.add('section');const name=document.createElement('span');name.textContent=item.title;const num=document.createElement('small');num.textContent=`${printedLabel(item.page)} 页`;btn.append(name,num);btn.onclick=()=>{go(item.page);toggleToc(false)};frag.append(btn)}if(!frag.childNodes.length){const p=document.createElement('p');p.textContent='没有找到相关曲目';frag.append(p)}$('tocItems').replaceChildren(frag)}
let noticeTimer;function notice(text){$('notice').textContent=text;$('notice').hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').hidden=true,4000)}
document.querySelector('.brand').onclick=e=>{e.preventDefault();go(1)};$('menu').onclick=()=>toggleToc(true);$('closeToc').onclick=$('shade').onclick=()=>toggleToc(false);$('search').oninput=e=>renderToc(e.target.value.trim());$('prev').onclick=()=>step(-1);$('next').onclick=()=>step(1);$('jump').onsubmit=e=>{e.preventDefault();jumpToPrinted($('pageInput').value)};$('progress').onchange=e=>go(e.target.value);$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{notice('当前浏览器暂不支持全屏')}};addEventListener('keydown',e=>{if(!authenticated||/INPUT|TEXTAREA/.test(e.target.tagName)||$('toc').classList.contains('open'))return;if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}if(e.key==='Home'){e.preventDefault();go(1)}if(e.key==='End'){e.preventDefault();go(book.pages)}});let touchX,touchY;$('book').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY},{passive:true});$('book').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)step(dx<0?1:-1)},{passive:true});addEventListener('resize',()=>{if(!book||busy)return;page=normalize(page);render(page);update()});addEventListener('hashchange',()=>{const n=Number(location.hash.match(/page=(\d+)/)?.[1]);history.replaceState(null,'',location.pathname+location.search);if(n)go(n)});

function accessBusy(active){ $('accessSubmit').disabled=active;$('accessPassword').disabled=active;$('accessSubmitText').textContent='进入'; }
async function openBook(metadata){
  accessBusy(true);
  try{
    book=metadata;$('total').textContent=printedTotal;$('progress').max=book.pages;
    const hash=Number(location.hash.match(/page=(\d+)/)?.[1]);page=normalize(hash||restore);
    const priority=[...new Set([...Array.from({length:Math.min(6,book.pages)},(_,i)=>i+1),...pagesAt(page,singleAt(page))])];
    await preload(priority);
    $('accessScreen').hidden=true;$('readerApp').hidden=false;
    render(page);renderToc();update();
    void loadWholeBook().catch(error=>console.warn('后台书页将在翻阅时继续读取',error));
  }catch(error){
    authenticated=false;book=null;$('readerApp').hidden=true;$('accessScreen').hidden=false;
    $('accessError').textContent=error.message||'书籍暂时无法打开，请重试。';$('accessError').hidden=false;
  }finally{accessBusy(false)}
}
$('accessForm').onsubmit=async event=>{
  event.preventDefault();if($('accessSubmit').disabled)return;
  const password=$('accessPassword').value;if(!password)return;
  accessBusy(true);$('accessError').hidden=true;
  try{
    const metadata=await unlockBook(password);authenticated=true;$('accessPassword').value='';await openBook(metadata);
  }catch(error){
    $('accessError').textContent=error.message||'暂时无法打开，请重试。';$('accessError').hidden=false;accessBusy(false);$('accessPassword').focus();
  }
};
$('accessPassword').focus();
addEventListener('beforeunload',()=>{for(const url of decryptedPages.values())URL.revokeObjectURL(url)});
