const T={budowa:{n:"Budowy",s:["Prace przygotowawcze","Etap projektowy","Zamówienie publiczne","Etap wykonawczy","Zrealizowana"],c:["#7c6cf0","#3b9ae1","#19b3a6","#7cc24a","#2e9e4f"]},
projekt:{n:"Projekty",s:["Przygotowanie OPZ","Wybór wykonawcy","W trakcie realizacji","Projekt wykonany"],c:["#7c6cf0","#3b9ae1","#7cc24a","#2e9e4f"]}};
const zl=v=>Number(v).toLocaleString("pl-PL",{style:"currency",currency:"PLN",maximumFractionDigits:0});
const dt=s=>new Date(s+"T00:00:00");
function prog(i){if(!i.signed||!i.dur)return null;const a=dt(i.signed),e=new Date(a);
 if(i.unit==="dni")e.setDate(e.getDate()+ +i.dur);else e.setMonth(e.getMonth()+ +i.dur);
 const n=new Date();return{p:Math.max(0,Math.min(1,(n-a)/(e-a))),e,late:n>e}}
async function load(){try{const d=await(await fetch("/api/data")).json();if(d&&d.items)return d.items}catch(e){}
 return(await fetch("/seed.json")).json()}
const mapInit=id=>{const m=L.map(id).setView([52.416,16.764],14);
 const o=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(m);
 const s=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:"Esri"});
 L.control.layers({"Mapa":o,"Ortofoto":s}).addTo(m);return m};
const mIcon=(t,c,on)=>L.divIcon({className:"",iconSize:[22,22],html:`<div class="m ${t}${on?" on":""}" style="background:${c}"></div>`});
