const SHIFTS=[
"Tue-D","Tue-N",
"Wed-D","Wed-N",
"Thu-D","Thu-N",
"Fri-D","Fri-N",
"Sat-D","Sat-N"
];

const RANKS=[
"Unit Member",
"Section Leader",
"Deputy Controller",
"Controller",
"Staff",
"Super Admin"
];

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

let users = JSON.parse(localStorage.getItem("users")) || {

admin:{
username:"admin",
name:"Aaron Robbins",
pass:"admin",
rank:"Super Admin",
group:"Member Operational",
num:"33",
roster:{}
}

};

let currentUser = localStorage.getItem("session") || "";

function save(){

localStorage.setItem("users",JSON.stringify(users));

}

function openScreen(id){

document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));

document.getElementById(id).classList.add("active");

if(id==="dashboard") renderDashboard();

if(id==="availability") renderAvailability();

if(id==="roster") renderRoster();

}

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

function logout(){

currentUser="";

localStorage.removeItem("session");

location.reload();

}

function renderDashboard(){

let available=0;

Object.values(users).forEach(u=>{

Object.values(u.roster).forEach(v=>{

if(v==="YES") available++;

});

});

dashMembers.innerText=available;

dashUDO.innerText="TBA";

dashVehicles.innerText="6";

}

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

if(currentUser && users[currentUser]){

initApp();

}
