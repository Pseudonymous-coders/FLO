let xmlHttp = new XMLHttpRequest();
xmlHttp.open('GET', '/api/smartDevices', false);
xmlHttp.send(null);
console.log(xmlHttp.responseText);
