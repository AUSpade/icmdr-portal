const SHIFTS=["Tue-D","Tue-N","Wed-D","Wed-N","Thu-D","Thu-N","Fri-D","Fri-N","Sat-D","Sat-N"];

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

let users=JSON.parse(localStorage.getItem("users"))||{
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

let currentUser=localStorage.getItem("session")||"";

function save(){
localStorage.setItem("users",JSON.stringify(users));
}

function toggleMenu(){
menu.classList.toggle("open");
}

function openScreen(id){

document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));

document.getElementById(id).classList.add("active");

menu.classList.remove("open");

if(id==="admin")renderAdmin();

if(id==="roster")renderRoster();

}

function login(){

const u=loginUser.value;
const p=loginPass.value;

const user=Object.values(users).find(x=>x.username===u&&x.pass===p);

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

menuUser.innerText=`${user.num} ${user.name}`;

pName.innerText=user.name;

pUser.innerText=user.username;

pRank.innerText=user.rank;

pGroup.innerText=user.group;

pNum.innerText=user.num;

loginScreen.style.display="none";

app.style.display="block";

if(ADMIN_RANKS.includes(user.rank)){

adminMenu.innerHTML='<button onclick="openScreen(`admin`)">Admin</button>';

}

renderProfileRoster();

}

function logout(){

currentUser="";

localStorage.removeItem("session");

app.style.display="none";

loginScreen.style.display="flex";

}

function renderProfileRoster(){

profileRoster.innerHTML="";

SHIFTS.forEach(s=>{

const v=users[currentUser].roster[s]||"";

profileRoster.innerHTML+=`
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

if(!v||v==="NA")return;

let cls="";

if(v==="YES")cls="yes";

if(v==="RCR")cls="rcr";

rosterView.innerHTML+=`
<div class="member">

<strong>${u.num} ${u.name}</strong> (${u.group})

<span class="${cls}">${v}</span>

</div>
`;

});

});

}

function renderAdmin(){

const me=users[currentUser];

memberList.innerHTML="";

addRank.innerHTML="";

RANKS.forEach(r=>addRank.innerHTML+=`<option>${r}</option>`);

addGroup.innerHTML="";

GROUPS.forEach(g=>addGroup.innerHTML+=`<option>${g}</option>`);

Object.values(users).forEach(u=>{

memberList.innerHTML+=`
<div class="member">

<strong>${u.num} ${u.name}</strong><br>

${u.rank} / ${u.group}<br>

<button onclick="editUser('${u.username}')">Edit</button>

${u.rank!=="Super Admin" && u.username!==currentUser ?

`<button class="delete-btn" onclick="deleteUser('${u.username}')">Delete</button>`:""}

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

function deleteUser(username){

if(users[username].rank==="Super Admin"){

alert("Cannot delete Super Admin");

return;

}

if(!confirm("Delete this member?"))return;

delete users[username];

save();

renderAdmin();

}

function editUser(username){

const u=users[username];

memberList.innerHTML=`
<div class="member">

Name <input id="eName" value="${u.name}">

Member # <input id="eNum" value="${u.num}">

Username <input id="eUser" value="${u.username}">

Password <input id="ePass" value="${u.pass}">

Rank

<select id="eRank">

${RANKS.map(r=>`<option ${u.rank===r?"selected":""}>${r}</option>`).join("")}

</select>

Group

<select id="eGroup">

${GROUPS.map(g=>`<option ${u.group===g?"selected":""}>${g}</option>`).join("")}

</select>

<button onclick="saveEdit('${username}')">Save</button>

</div>
`;

}

function saveEdit(oldKey){

const newUser=eUser.value.trim();

if(newUser!==oldKey && users[newUser]){

alert("Username exists");

return;

}

users[newUser]={

username:newUser,

name:eName.value,

pass:ePass.value,

rank:eRank.value,

group:eGroup.value,

num:eNum.value,

roster:users[oldKey].roster||{}

};

if(newUser!==oldKey) delete users[oldKey];

save();

renderAdmin();

}

if(currentUser && users[currentUser]){

initApp();

}
