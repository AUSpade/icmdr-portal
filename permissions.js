/* ---------------- POWER LEVELS ---------------- */

const RANKS = {

"Junior Member":0,
"Probationary Member":1,
"Support Member":2,
"Member Operational":3,

"Section Leader":4,
"Deputy Controller":5,
"Controller":6,

"Staff":7,

"Super Admin":100

};


/* ---------------- PERMISSION RULES ---------------- */

const PERMISSIONS = {

UMT:4,

VEHICLE_CONTROL:4,

ANNOUNCEMENTS:5,

USER_MANAGEMENT:5,

SUPER_ADMIN:100

};


/* ---------------- PERMISSION CHECK ---------------- */

function hasPermission(permission){

if(!users || !users[currentUser]) return false;

if(!PERMISSIONS[permission]) return false;

return users[currentUser].power >= PERMISSIONS[permission];

}
