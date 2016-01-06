console.log(window.gStudentId);
console.log("LATEST UPDATE: 3.1");
var studentId = document.getElementById('id');
studentId.innerText = gStudentId;

var m2x = window.M2X;
var deviceId= window.deviceId;
var apiKey = window.apiKey;


m2x.status(function(result)
{
  console.log(result);
  if(result)
    console.log('M2X works! YEAHAHHAHA');
  else
    console.log("nope. Just . . .nope");
});

console.log(window.M2X);

var skillId = [];
var skillNames = [];
var skills = document.getElementById('skills');
var remove = document.getElementById('remove');
var testNumber = 0;
window.M2X.devices.streams(window.deviceId, function(streamList)
{
  var skillNumber = 0;
  var number = 0;
  console.log(streamList);
  console.log("streamList values " + streamList.streams.length);
  for(var i = 0; i < streamList.streams.length; i++)
  {
    if(streamList.streams[i].name == "students")
      console.log("Students stream reached. Abort now");
    if((streamList.streams[i].name != "students") && (streamList.streams[i].name != "log"))
    {
      console.log(streamList.streams[i].name);
      console.log("THIS SHOULD RUN ONCE THIS SHOULD RUN ONCE");
      skillId.push(streamList.streams[i].name);
      skillNames.push(streamList.streams[i].display_name);
      //console.log(streamList.streams[i].name);
      window.M2X.devices.streamValues(window.deviceId, streamList.streams[i].name, function(result)
      {
        console.log("Before if: ");
        console.log(skillId);
        if(result.values.length !== 0)
        {
          console.log("Before for: ");
          for(var j = 0; j < result.values.length; j++)
          {
            console.log(result.values.length);
            console.log("student ID: ");
            console.log(studentId.innerText);
            console.log(result.values[j].value);
            if(studentId.innerText === result.values[j].value && (skillId[j] != "students"))
            {
              console.log(skillNames);
              console.log("i is: " + skillNumber);
              var skillName = document.createElement('ul');
              console.log("SKILLNAMES i is: " + skillNames[skillNumber]);
              console.log(skillNames);
              skillName.innerText = skillNames[j];
              skills.appendChild(skillName);
              
              var removeSkill = document.createElement('option');
              removeSkill.value = skillId[j];
              removeSkill.innerText = skillNames[j];
              remove.appendChild(removeSkill);
            }
            else
            {
              console.log("NOPE: " + result.values[j].value);
            }
            
          }
        }
        
      })
      skillNumber = skillNumber + 1;
      //console.log(result.values[result.values.length - 1]);
    }
    else
    {
      console.log("Got to students!");
    }
  }
  
  console.log(skillId);
  console.log(streamList.streams[0].name);
});



var home = document.getElementById('home');
home.addEventListener('click', function()
{
  document.body.innerHTML = "";
  document.write(window.index);
});

var add = document.getElementById('add');

window.M2X.devices.streams(window.deviceId, function(streamList)
{
  var skillNumber = 0;
  console.log(streamList);
  console.log("# of streams: " + streamList.streams.length);
  for(var i = 0; i < streamList.streams.length; i++)
  {
    if(streamList.streams[i].name !== "students")
    {
      var skill = document.createElement('option');
      skill.setAttribute('value', streamList.streams[i].name);
      skill.innerText = streamList.streams[i].display_name;
      add.appendChild(skill);
    }
  }
});
add.onchange = function()
{
  console.log("You changed add");
  if(add.options[add.selectedIndex].value !== "addselect")
  {
    console.log("You didn't select add");
    window.M2X.devices.setStreamValue(window.deviceId, add.options[add.selectedIndex].value, {"value":window.gStudentId}, function(result)
    {
      console.log("SetStreamValue is successfule");
    }, function(error){console.log("SetStreamValue WASN'T successful")});
  }
  else
  {
    console.log("You selected add");
  }
}

remove.onchange = function()
{
  console.log("You changed remove");
  if(remove.options[remove.selectedIndex].value !== "removeselect")
  {
    console.log("You didn't select remove");
    window.M2X.devices.streams(window.deviceId, function(streamList)
    {
      window.M2X.devices.streamValues(window.deviceId, remove.options[remove.selectedIndex].value, function(result)
      {
        var timeStamp = "";
        var beginStamp = "";
        var endStamp = "";
        console.log("Stream has: " + result);
        for(var i = 0; i < result.values.length; i++)
        {
          
          console.log(result.values[i].value);
          if(result.values[i].value == window.gStudentId)
          {
            console.log("Found user to remove! ");
            timeStamp = result.values[i].timestamp;
            console.log(timeStamp);
            var splitStamp = timeStamp.split(":");
            var furtherSplitStamp = splitStamp[2].split(".");
            console.log(timeStamp.split(":"));
            console.log(furtherSplitStamp);
            beginStamp = splitStamp[0] + ":" + splitStamp[1] + ":" + (Number(furtherSplitStamp[0]) - 1) + "." + furtherSplitStamp[1];
            console.log(beginStamp);
            endStamp = splitStamp[0] + ":" + splitStamp[1] + ":" + (Number(furtherSplitStamp[0]) + 1) + "." + furtherSplitStamp[1];
            console.log(endStamp);
            m2x.devices.deleteStreamValues(deviceId, remove.options[remove.selectedIndex].value, {"from":beginStamp, "end": endStamp}, function(worked)
            {
              console.log("Deletion worked!");
            }, function(error){console.log("Error in deleteStreamValues: " + error)})
          }
        }
        
        console.log(result.values)
        
      }, function(error) {console.log("Stream error is: " + error);});
    })
    
  }
}