//var gStudentId;
console.log(window.gStudentId);
console.log("GOT TO SKILLS");

var home = document.getElementById('home');
home.addEventListener('click', function()
{
  document.body.innerHTML = "";
  document.write(window.index);
})

var submitId = document.getElementById('submitid');
console.log(submitId);
submitId.addEventListener('click', function()
{
  console.log('clicked SUBMIT id');
  var idInput = document.getElementById('idinput');
  console.log(window.gStudentId);
  //gStudentId = Number(idInput.value);
  gStudentId = idInput.value;
  if(gStudentId)
  {
    
    window.M2X.status(function(result)
    {
      if(!result)
      {
        console.log("Cannot connect to servers. Is AT&T down?");
      }
      else
      {
        if(!gStudentId)
          var gStudentId;
        window.M2X.devices.streamValues(window.deviceId, "students", function(result)
        {
          for(var i = 0; i < result.values.length; i++)
          {
            if(result.values[i].value === window.gStudentId)
            {
              document.body.innerHTML = "";
              document.write(window.studentlayout);
            }
            else
            {
              console.log("This isn't a student!");
            }
          }
          
        })
        console.log("Verifing student . . .");
        //window.location.href = 'studentlayout.html';
        //Create the student layout page (the .html file is just )
        /*
        document.body.innerHTML = "";
        //document.write('<!DOCTYPE html><html><style>#body {outline:white solid 0.5px;padding: 40px 75px;border-radius: 3px;color:rgba(200,200,200,0.7);font-weight: bold;border: none;margin: 0;background: rgba(0,0,0,0.4);font-family: helvetica, arial, sans-serif;font-size: 45pt;position:absolute;TOP:25px;RIGHT:100px;LEFT: 100px;BOTTOM: 50px;}#id {outline:white solid 0.5px;padding: 15px 150px;border-radius: 3px;color:rgba(200,200,200,0.7);font-weight: bold;border: none;margin: 0;background: rgba(0,0,0,0.4);font-family: helvetica, arial, sans-serif;font-size: 24pt;position:absolute;TOP:45px;LEFT: 125px;}#main {outline:white solid 0.5px;padding: 40px 75px;border-radius: 3px;color:rgba(200,200,200,0.7);font-weight: bold;border: none;margin: 0;background: rgba(0,0,0,0.4);font-family: helvetica, arial, sans-serif;font-size: 45pt;position:absolute;TOP:150px;RIGHT:120px;LEFT: 120px;BOTTOM: 75px;}#home {outline:white solid 0.5px;padding: 20px 100px;border-radius: 3px;color:rgba(200,200,200,0.7);font-weight: bold;border: none;margin: 0;background: rgba(0,0,0,0.4);font-family: helvetica, arial, sans-serif;font-size: 32pt;position:absolute;TOP:45px;RIGHT: 150px;}#home:hover {background: rgba(0,0,0,0.4);color:rgba(140,140,140,0.8);}#skills {outline:white solid 0.5px;padding: 15px 20px;border-radius: 3px;color:rgba(200,200,200,0.7);font-weight: bold;border: none;margin: 0;background: rgba(0,0,0,0.6);font-family: helvetica, arial, sans-serif;font-size: 24pt;position:absolute;LEFT: 125px;width: 77%;}</style><body background="images/background.jpg"><div id="body"></div><div id="id">ID</div><div id="main"></div><ul id="skills" style="TOP:165px;"><ul>Saw</ul><ul>Drill</ul><ul>Driver</ul></ul><a href="index.html" id="home">Home</a><script src="studentlayout.js"></script></body></html>');
        document.write(window.studentlayout);
        */
      }
    })
  }
  else
  {
    console.log("You need to put a student ID!");
  }
  
});

//})