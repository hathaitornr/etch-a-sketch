var COLOUR =  '#ffa726';  // This is the drawing color
var radius = 3;           // Constant radio for the line
var socket = io();        // websocket to the server
var previousPosition=[0,0]; // previous position to draw a line from
var ctx = Sketch.create(); //Creating the drawing context
var firstMessage=true;    // What the first message, to start on the first value

function getRand(val) {
    return Math.floor(Math.random() * Math.floor(val));
}

function getRandomMinion(){
    var dir = 'minion';
    var fileNames = ['minion1.png','minion2.png','minion3.png','minion4.png','minion5.png','minion6.png'];
    var index = getRand(fileNames.length);
    return dir + '/' + fileNames[index];
}
    ctx.container = document.getElementById( 'container' ); //reference drawing canvas
    ctx.autoclear= false; // making sure it stays
    ctx.retina='auto';
    ctx.setup = function() { console.log( 'setup' );} // Setup all variables
    ctx.keydown= function() { if ( ctx.keys.C ) ctx.clear();} // handeling keydowns

    socket.on('reset', function() { // on a 'reset' message clean and reste firstMessage
      firstMessage=true;
      ctx.clear();
    });


    socket.on('minion', function() {
      var maxX = 1000;
      var maxY = 1000;
      console.log('hihi');
      var image = new Image();
      image.src = getRandomMinion();
      image.onload = function(){
          var width = image.width;
          var height = image.height;
          ctx.drawImage(image, previousPosition[0], previousPosition[1], width/6, height/6);
      console.log(previousPosition[0]+', '+previousPosition[1] + 'w: ' + width + 'h: ' + height);
      }
    });


    socket.on('new-pos', function(newPosition) { // handling new sensor values
      // map the incoming 10-bit numbers to the height and width of the screen.
      var x0 = 0;
      var x1 = ctx.width;
      var y0 = 0;
      var y1 = ctx.height;
      newPosition[0] = map(newPosition[0], 0, 1023, x0, x1);
      newPosition[1] = map(newPosition[1], 0, 1023, y0, y1);
      
      console.log('drawing');
      if(firstMessage){ // if its the first message store that value as previous
        firstMessage=false;
        previousPosition=newPosition;
      }else{ // any other message we use to draw.
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = ctx.strokeStyle = COLOUR;
        ctx.lineWidth = radius;
        ctx.beginPath();  //begin a drawing
        ctx.moveTo( previousPosition[0], previousPosition[1] ); // from
        ctx.lineTo( newPosition[0],  newPosition[1]); // to
        ctx.stroke(); // and only draw a stroke
        previousPosition=newPosition; // update to the new position.
       }
    });
