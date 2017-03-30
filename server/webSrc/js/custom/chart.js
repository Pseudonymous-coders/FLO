let ctx = document.getElementById('lastNight');

function lastNight() {
  var xmlReq = new XMLHttpRequest();
  xmlReq.open("GET", "https://slumber.ddns.net/api/userData/0-9999999999999999999999999", false);
  xmlReq.send(null);
  var sleepData = JSON.parse(xmlReq.responseText).slice(0);
  var sleepJson = [
    {
      label: 'Accel',
      data: [],
      backgroundColor: [
        'rgba(255,193,7,0.2)'
      ],
      borderColor: [
        'rgb(255,193,7)'
      ],
      pointBackgroundColor: "rgba(255,193,7,0.2)",
      fill: true,
      showLine: true

    },
    {
      label: 'Temp',
      data: [],
      backgroundColor: [
        'rgba(255,61,0,0)'
      ],
      borderColor: [
        "rgb(255,61,0)"
      ],
    },
    {
      label: 'Humidity',
      data: [],
      backgroundColor: [
        'rgba(3,169,244,0)'
      ],
      borderColor: [
        'rgb(3,169,244)'
      ],
    },
    {
      label: "Battery",
      data: [],
      backgroundColor: [
        'rgba(76,175,80,0)'
      ],
      borderColor: [
      'rgb(76,175,80)'
    ],
    }
  ]
  if (sleepData[0]){
    var firstTime = sleepData[0].time,
        lastTemp = 0,
        lastHum = 0,
        lastAccel = 0,
        lastBatt = 0;
  } else {
    sleepJson[0].data.push({x:0,y:0});
    sleepJson[1].data.push({x:0,y:0});
    sleepJson[2].data.push({x:0,y:0});
    sleepJson[3].data.push({x:0,y:0});
  }
  sleepData.forEach((item)=>{
    var d = new Date(0);
    d.setUTCSeconds(item.time)
    // var sleepTime = item.time,
    var sleepTime = d.toString(),
    sleepTemp = item.temp,
    sleepHum = item.hum,
    sleepAccel = item.accel,
    sleepBatt = (parseInt(item.vbatt)-350)*1.25;

    // Used to log ALL data regardless of same-value data
    /*
    sleepJson[0].data.push({x:sleepTime,y:sleepAccel});
    sleepJson[1].data.push({x:sleepTime,y:sleepTemp});
    sleepJson[2].data.push({x:sleepTime,y:sleepHum});
    sleepJson[3].data.push({x:sleepTime,y:sleepBatt});
    */

    if (!sleepBatt){
      sleepBatt = lastBatt;
      sleepJson[2].data.push({x:sleepTime, y: sleepHum});
    }
    if (sleepTemp != lastTemp){
      sleepJson[1].data.push({x:sleepTime, y: sleepTemp});
    }
    if (sleepHum != lastHum){
      sleepJson[2].data.push({x:sleepTime, y: sleepHum});
    }
    if (sleepAccel != lastAccel) {
      sleepJson[0].data.push({x:sleepTime, y: sleepAccel});
    }
    if (sleepBatt != lastBatt){
      sleepJson[3].data.push({x:sleepTime, y: sleepBatt});
    }
    lastTemp = sleepTemp;
    lastHum = sleepHum;
    lastAccel = sleepAccel;
    lastBatt = sleepBatt;

    if (item == sleepData[sleepData.length-1]) {
      sleepJson[0].data.push({x:sleepTime,y:sleepAccel});
      sleepJson[1].data.push({x:sleepTime,y:sleepTemp});
      sleepJson[2].data.push({x:sleepTime,y:sleepHum});
      sleepJson[3].data.push({x:sleepTime,y:sleepBatt});
    }
  })
  if (!sleepJson[0].data){
    sleepJson[0].data.push({x:0,y0});
    sleepJson[1].data.push({x:0,y0});
    sleepJson[2].data.push({x:0,y0});
    sleepJson[3].data.push({x:0,y0});
  }
  return sleepJson
}

var data = lastNight();

var myChart = new Chart(ctx, {
  type: 'line',
  data:{
    datasets: data
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        unit: 'hours',
        ticks: {
          autoSkip: true,
          maxRotation: 90,
          minRotation: 90
        },
        unitStepSize: 5,
        time: {
          displayFormats: {
            hours: 'HH:MM'
          }
        }
      }]
    },
  }
});
  // document.getElementById('graphParent').style.height = "1000px";
