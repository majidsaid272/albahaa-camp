/* اتصال صفحات الحجز بـ Apps Script — بدون ملفات تعريف الارتباط، مع بديل JSONP */
window.AB = (function(){
 var API='https://script.google.com/macros/s/AKfycbwOGKBm3I7JCAxDSn4WghaTMl2HwjzN-xa05gj3dk-U1geaCEei6wa34F7YnENuPa3n3Q/exec';
 var WA='96897663361';
 var transport=null,n=0;
 var DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
 var MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
 var PNAME={am:'الصباحية',pm:'المسائية'},PTIME={am:'من ٩ صباحاً إلى ٣ عصراً',pm:'من ٥ مساءً إلى ١١ ليلاً'};
 var SAFE={status:1,verify:1,pending:1};
 function jsonp(url,cb,fail){
  var name='__ab'+(++n)+'_'+Date.now(),s=document.createElement('script'),done=false;
  var t=setTimeout(function(){if(!done){done=true;clean();fail('تعذّر الاتصال، تأكد من الإنترنت وحاول مرة أخرى')}},25000);
  function clean(){clearTimeout(t);try{delete window[name]}catch(e){window[name]=undefined}if(s.parentNode)s.parentNode.removeChild(s)}
  window[name]=function(j){if(done)return;done=true;clean();cb(j)};
  s.onerror=function(){if(done)return;done=true;clean();fail('تعذّر الاتصال، تأكد من الإنترنت وحاول مرة أخرى')};
  s.src=url+'&callback='+name;document.body.appendChild(s);
 }
 function call(action,params,ok,fail){
  var p={action:action};Object.keys(params||{}).forEach(function(k){p[k]=String(params[k]==null?'':params[k])});p.t=Date.now();
  var url=API+'?'+new URLSearchParams(p).toString();
  function handle(j){if(!j)fail('حدث خطأ، حاول مرة أخرى');else if(j.error)fail(j.error);else ok(j.data)}
  if(window.fetch&&transport!=='jsonp'){
   fetch(url,{credentials:'omit',redirect:'follow',cache:'no-store'})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(j){transport='fetch';handle(j)},function(){
      if(SAFE[action]){transport='jsonp';jsonp(url,handle,fail)}
      else fail('تعذّر التأكد من وصول الطلب. لا تعِد الإرسال، وتواصل معنا عبر واتساب للتأكد.');
    });
  }else jsonp(url,handle,fail);
 }
 function ar(s){return String(s).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]})}
 function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
 function dateLabel(s){var p=s.split('-'),d=new Date(+p[0],p[1]-1,+p[2]);return DAYS[d.getDay()]+' '+ar(+p[2])+' '+MONTHS[p[1]-1]+' '+ar(p[0])}
 function phoneIntl(ph){ph=String(ph||'').replace(/\D/g,'');if(ph.length===8)ph='968'+ph;if(ph.indexOf('00')===0)ph=ph.slice(2);return ph}
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function store(k,v){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
 function load(k){try{return localStorage.getItem(k)}catch(e){return null}}
 function busy(btn,on,label){btn.disabled=on;btn.innerHTML=on?'<span class="spin"></span>':label}
 return {call:call,ar:ar,today:today,dateLabel:dateLabel,phoneIntl:phoneIntl,esc:esc,store:store,load:load,busy:busy,WA:WA,PNAME:PNAME,PTIME:PTIME};
})();
