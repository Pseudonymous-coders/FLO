console.log("GOT TO SKILLREVIEWS");
var home = document.getElementById('home');
home.addEventListener('click', function()
{
  console.log("FDJSLK:");
  document.body.innerHTML = "";
  document.clear();
  document.write(window.index);
});

var removeList = document.getElementById('removeList');
console.log(removeList);
var loading = document.createElement('option');
loading.setAttribute('value', 'Loading');
loading.innerText = 'Loading . . .';
removeList.appendChild(loading);
window.M2X.devices.streams(window.deviceId, function(streamList)
{
  var skillNumber = 0;
  console.log(streamList);
  console.log("# of streams: " + streamList.streams.length);
  removeList.removeChild(loading);
  for(var i = 0; i < streamList.streams.length; i++)
  {
    if(streamList.streams[i].name !== "students")
    {
      var skill = document.createElement('option');
      skill.setAttribute('value', streamList.streams[i].name);
      skill.innerText = streamList.streams[i].display_name;
      removeList.appendChild(skill);
    }
  }
});

var addText = document.getElementById('textadd');

var submit = document.getElementById('submit');
submit.addEventListener('click', function()
{
  console.log("Clicked submit!");
  if(addText.value !== "")
  {
    var streamName = "";
    console.log("Adding stream: " + addText.value);
    streamName = "skillReview_" + addText.value;
    window.M2X.devices.updateStream(window.deviceId, streamName, {"type": "numeric", "display_name":addText.value}, function(result)
    {
      console.log(result);
    }, function(error){console.log("updateStream error: " + error);})
  }
  if(removeList.options[removeList.selectedIndex].value !== "Loading")
  {
    console.log("I need to remove!");
    window.M2X.devices.deleteStream(window.deviceId, removeList.options[removeList.selectedIndex].value, function(result)
    {
      console.log("Remove successful!");
    }, function(error) {console.log("Remove NOT succesful!")});
  }
})