const T={budowa:{n:"Budowy",s:["Prace przygotowawcze","Etap projektowy","Zamówienie publiczne","Etap wykonawczy","Zrealizowana"],c:["#7e57c2","#1e88e5","#e91e63","#ff8f00","#2e9e4f"]},
projekt:{n:"Projekty",s:["Przygotowanie OPZ","Wybór wykonawcy","W trakcie realizacji","Projekt wykonany"],c:["#7e57c2","#1e88e5","#ff8f00","#2e9e4f"]}};
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
 const g=L.tileLayer("https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTOFOTOMAPA&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{z}&TILEROW={y}&TILECOL={x}",{maxZoom:19,attribution:"© GUGiK (Geoportal)"});
 L.control.layers({"Mapa":o,"Ortofoto (Geoportal)":g,"Ortofoto (Esri)":s}).addTo(m);return m};
const ST={"unieważnione":{n:"Postępowanie unieważnione",c:"#c62828"},"wstrzymane":{n:"Wstrzymane",c:"#5d4037"}};
const mIcon=(t,c,on,s)=>L.divIcon({className:"",iconSize:[22,22],html:`<div class="m ${t}${on?" on":""}" style="background:${c}${ST[s]?";border:3px solid "+ST[s].c:""}"></div>`});
