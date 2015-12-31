//console.log("Got to student home .. . what?");
var home = document.getElementById('layouthome');
home.addEventListener('click', function()
{
  console.log("HKJLFEJSL:")
  document.body.innerHTML = "";
  document.write(window.index);
});

var studentList = document.getElementById('list');

function updateList(list)
{
  this.innerHTML = "";
  window.M2X.devices.streamValues(window.deviceId, "students", function(result)
  {
    console.log(result.values);
    for(var i = 0; i < result.values.length; i++)
    {
      console.log(result.values[i].value);
      var student = document.createElement('ul');
      student.innerText = result.values[i].value;
      list.appendChild(student);
    }
  })
}

updateList(studentList);

var addInput = document.getElementById('addinput');

var add = document.getElementById('add');
add.addEventListener('click', function()
{
  if(addInput.value !== "")
  {
    window.M2X.devices.setStreamValue(window.deviceId, "students", {"value": addInput.value}, function(result)
    {
      console.log("setStreamValue result: " + result);
      updateList(studentList);
    }, function(error){console.log("setStreamValue error: " + error)});
  }
  else
  {
    console.log("You need input to add a student!");
  }
})

var removeInput = document.getElementById('removeinput');

var remove = document.getElementById('remove');

remove.addEventListener('click', function()
{
  console.log('clicked Remove');
  if(removeInput.value === "")
  {
    console.log("You need to provide an ID to remove!");
  }
  else
  {
    console.log("Removing . . .");
    window.M2X.devices.streams(deviceId, function(streamList)
    {
      console.log(streamList.length);
      for(var j = 0; j < streamList.length; j++)
      {
        console.log("Stream found: ");
        window.M2X.devices.streamValues(deviceId, streamList[j].name, function(result)
        {
          console.log(result);
          var timeStamp = "";
          var beginStamp = "";
          var endStamp = "";
          console.log("Stream has: " + result);
          for(var i = 0; i < result.values.length; i++)
          {
            
            console.log(result.values[i].value);
            if(result.values[i].value == removeInput.value)
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
              window.M2X.devices.deleteStreamValues(deviceId, "students", {"from":beginStamp, "end": endStamp}, function(worked)
              {
                console.log("Deletion worked!");
                updateList(studentList);
              }, function(error){console.log("Error in deleteStreamValues: " + error)})
            }
            else
            {
              console.log(result.values[i].value + " is not equal to " + removeInput.value);
            }
          }
          
          console.log(result.values)
          
        }, function(error) {console.log("Stream error is: " + error);});
      }
    })
    
  }
  
})