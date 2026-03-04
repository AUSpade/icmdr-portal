/* ---------------- VEHICLES ---------------- */

let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [

{ name:"Rescue 1", location:"Morwell", status:"Online" },
{ name:"Rescue 2", location:"Morwell", status:"Online" },
{ name:"Support 1", location:"Morwell", status:"Online" },
{ name:"Support 2", location:"Morwell", status:"Online" },
{ name:"RB 521", location:"Morwell", status:"Online" },
{ name:"RB 522", location:"Morwell", status:"Online" },
{ name:"Storm Trailer", location:"Morwell", status:"Online" },
{ name:"RCR Trailer", location:"Morwell", status:"Online" }

];

function saveVehicles(){

localStorage.setItem("vehicles",JSON.stringify(vehicles));

}


function renderVehicles(){

const table=document.querySelector(".vehicleTable");

let rows=`
<tr>
<th>Vehicle</th>
<th>Location</th>
<th>Status</th>
<th>Available</th>
</tr>
`;

vehicles.forEach((v,index)=>{

let dot="green";

if(v.status==="Offline") dot="red";
if(v.status==="Training") dot="yellow";
if(v.status==="Service") dot="gray";

rows+=`
<tr>

<td>${v.name}</td>

<td>
<input value="${v.location}"
onchange="updateVehicleLocation(${index},this.value)">
</td>

<td>
<select onchange="updateVehicleStatus(${index},this.value)">

<option ${v.status==="Online"?"selected":""}>Online</option>
<option ${v.status==="Offline"?"selected":""}>Offline</option>
<option ${v.status==="Training"?"selected":""}>Training</option>
<option ${v.status==="Service"?"selected":""}>Service</option>

</select>
</td>

<td>
<span class="dot ${dot}"></span>
</td>

</tr>
`;

});

table.innerHTML=rows;

}


function updateVehicleStatus(index,status){

vehicles[index].status=status;

saveVehicles();

renderVehicles();

renderDashboard();

}


function updateVehicleLocation(index,location){

vehicles[index].location=location;

saveVehicles();

}


/* ---------------- SHIFT SYSTEM ---------------- */

const SHIFTS=[
"Tue-D","Tue-N",
"Wed-D","Wed-N",
"Thu-D","Thu-N",
"Fri-D","Fri-N",
"Sat-D","Sat-N"
];


/* ---------------- RANKS ---------------- */


const GROUPS=[
"Probation",
"Member Operational",
"UDO",
"Life Member",
"Ops Officer"
];

const ADMIN_RANKS=[
"Section Leader",
"Deputy Controller",
"Controller",
"Staff",
"Super Admin"
];


/* ---------------- USERS ---------------- */

let users = JSON.parse(localStorage.getItem("users")) || {

admin:{
username:"admin",
name:"Aaron Robbins",
pass:"admin",
rank:"Super Admin",
power:100,
group:"Member Operational",
num:"33",
roster:{}
}

};

let currentUser = localStorage.getItem("session") || "";


/* ---------------- SAVE ---------------- */

function save(){

localStorage.setItem("users",JSON.stringify(users));

}


/* ---------------- NAVIGATION ---------------- */

function openScreen(id){

document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));

document.getElementById(id).classList.add("active");

if(id==="dashboard") renderDashboard();

if(id==="availability") renderAvailability();

if(id==="roster") renderRoster();

if(id==="vehicles") renderVehicles();

}


/* ---------------- LOGIN ---------------- */

function login(){

const u=loginUser.value;
const p=loginPass.value;

const user=Object.values(users).find(x=>x.username===u && x.pass===p);

if(!user){

loginErr.style.display="block";
return;

}

currentUser=user.username;

localStorage.setItem("session",currentUser);

initApp();

}


function initApp(){

const user=users[currentUser];

menuUser.innerText=`Logged in as ${user.name}`;

loginScreen.style.display="none";

app.style.display="block";

renderDashboard();

}


/* ---------------- LOGOUT ---------------- */

function logout(){

currentUser="";

localStorage.removeItem("session");

location.reload();

}


/* ---------------- DASHBOARD ---------------- */

function renderDashboard(){

let available=0;

Object.values(users).forEach(u=>{

Object.values(u.roster).forEach(v=>{

if(v==="YES") available++;

});

});

dashMembers.innerText=available;

dashUDO.innerText="TBA";

let ready=vehicles.filter(v=>v.status==="Online").length;

dashVehicles.innerText=ready;

}


/* ---------------- AVAILABILITY ---------------- */

function renderAvailability(){

availabilityGrid.innerHTML="";

SHIFTS.forEach(s=>{

const v=users[currentUser].roster[s]||"";

availabilityGrid.innerHTML+=`

<div class="shift">

<strong>${s}</strong>

<select onchange="updateMyRoster('${s}',this.value)">

<option value="">—</option>

<option ${v==="YES"?"selected":""}>YES</option>

<option ${v==="RCR"?"selected":""}>RCR</option>

<option ${v==="NA"?"selected":""}>NA</option>

</select>

</div>

`;

});

}


function updateMyRoster(shift,val){

users[currentUser].roster[shift]=val;

save();

}


/* ---------------- ROSTER ---------------- */

function renderRoster(){

rosterView.innerHTML="";

SHIFTS.forEach(s=>{

rosterView.innerHTML+=`<h3>${s}</h3>`;

Object.values(users).forEach(u=>{

const v=u.roster[s];

if(!v||v==="NA") return;

rosterView.innerHTML+=`

<div class="member">

<strong>${u.num} ${u.name}</strong> (${u.group}) – ${v}

</div>

`;

});

});

}


/* ---------------- UMT ---------------- */

function openUMT(section){

const content=document.getElementById("umtContent");

if(section==="members"){

content.innerHTML=`

<h3>Member Management</h3>

<input id="addName" placeholder="Full name">
<input id="addUsername" placeholder="Username">
<input id="addPassword" placeholder="Password">
<input id="addNumber" placeholder="Member number">

<select id="addRank"></select>
<select id="addGroup"></select>

<button onclick="createUser()">Create Member</button>

<hr>

<div id="memberList"></div>

`;

renderAdmin();

}

if(section==="calendar"){

content.innerHTML=`<h3>Unit Calendar</h3><p>Calendar system coming soon.</p>`;

}

if(section==="announcements"){

content.innerHTML=`<h3>Unit Announcements</h3><p>Create announcements for members.</p>`;

}

}


/* ---------------- MEMBER ADMIN ---------------- */

function renderAdmin(){

addRank.innerHTML="";
RANKS.forEach(r=>addRank.innerHTML+=`<option>${r}</option>`);

addGroup.innerHTML="";
GROUPS.forEach(g=>addGroup.innerHTML+=`<option>${g}</option>`);

memberList.innerHTML="";

Object.values(users).forEach(u=>{

memberList.innerHTML+=`

<div class="member">

<strong>${u.num} ${u.name}</strong><br>

${u.rank} / ${u.group}

</div>

`;

});

}


/* ---------------- CREATE USER ---------------- */

function createUser(){

if(!addUsername.value){

alert("Username required");
return;

}

if(users[addUsername.value]){

alert("Username exists");
return;

}

users[addUsername.value]={

username:addUsername.value,
name:addName.value,
pass:addPassword.value,
rank:addRank.value,
group:addGroup.value,
num:addNumber.value,
roster:{}

};

save();

renderAdmin();

}


/* ---------------- AUTO LOGIN ---------------- */

if(currentUser && users[currentUser]){

initApp();

}
