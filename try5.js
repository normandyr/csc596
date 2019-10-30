// module aliases
var Engine = Matter.Engine, //this assigns a new engine to Engine to manage simulation
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Bounds = Matter.Bounds,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Mouse = Matter.Mouse,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Vertices = Matter.Vertices,
    Vector = Matter.Vector,
    Svg = Matter.Svg;

//Variable intializations which include screen view, object constants, speed variables
var viewHeight = 400;  ///in pixels height and width change to viewHeight and viewWidth
var additional = 500;
var viewWidth = 800;
var wheelRadius = 32;

var legThick = 10;
var legLength = wheelRadius;

var legCount = 5;
var legFriction = -0.1;
var legRestituion = 0.1;  
const MAX_SPEED = 0.75;
const MAX_SPEED_BACKWARDS = MAX_SPEED * 0.75;
const ACCELERATION = MAX_SPEED / 130;
const ACCELERATION_BACKWARDS = ACCELERATION * 0.75;


var sceneCenter = viewWidth / 2,
sceneMiddle = viewHeight / 2,
wheelYOffset = viewHeight - wheelRadius * 2,
wheelXOffset = sceneCenter;


// create an engine
//here created a new engine controller to manage the simulation based on
//under properities of documentation
/*positionIterations - specifies the number of position iterations to perform each update. 
The higher the value, the higher quality the simulation will be 
at the expense of performance*/
/*velocityIterations - specifies the number of velocity iterations to perform each update. 
The higher the value, the higher quality the simulation will be 
at the expense of performance.*/

var engine = Engine.create({options: {positionIterations: 2, velocityIterations: 6}}); //here created a new engine controller to manage the simulation based on


//under properities of documentation
// create a renderer
var render = Render.create({
    element: document.body,
     //this is saying to stick the canvas in the html body will show
    //canvas creation in elements under inspect //why don't i need to have it be render.element
    //like in the documentation because render.element render is just the name of the variable to 
    //which the element will be assigned to
    engine: engine, //A reference to the Matter.Engine instance to be used.
    options:{
        showAngleIndicator: false,
        showAxes: false,
        showConvexHulls: false,
        anchors: false,
        height: viewHeight,
        width: viewWidth,
        hasBounds: true,
        wireframes: false
    }
});

//starting platform creation for player to choose which side to go to and fall off
var platform = Bodies.rectangle(400, 410, viewWidth+100, 60, { isStatic: true });
var obstacles1 = Bodies.rectangle(500, 410, viewWidth+100, 60, { isStatic: true });



//loading SVGS for terrain and obstacles
var svgs = [
  'download'
];

console.log(car)


 var vertexSets = [];
//getting SVG coords to use in game and load to screen
for (var i = 0; i < 1; i += 1) {
  //$.get('/svg/' + svgs[i] + '.svg').done(function(data)
  (function(i) {
      $.get(svgs[i] + '.svg').done(function(data) {
        
              //var color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

          $(data).find('path').each(function(i, path) {
              var points = Svg.pathToVertices(path, 15);
              vertexSets.push((points));
          });


        World.add(engine.world, [platform,obstacles1, Bodies.fromVertices(400, 310, vertexSets, {isStatic: true,
            friction: 0.04,
          }, true, 0.01, 1)]);
      });
  })(i);
}


//creating wheel base for both wheels
var wheelBaseLeft = Bodies.circle(wheelXOffset, wheelYOffset-100, wheelRadius,{
  collisionFilter: {group: -1},
  density: 0.001,
  friction: 0.001
 

});

var wheelBaseRight = Bodies.circle(wheelXOffset+ 100, wheelYOffset-100, wheelRadius,{
  collisionFilter: {group: -1},
  density: 0.001,
  friction: 0.001
});


//creating wheel body for both wheels to hold legs
var wheelBodyLeft = [wheelBaseLeft];
var wheelBodyRight = [wheelBaseRight];


//creating legs for both wheel bodies using math (circle is 2pi and etc)
for(i=0; i<legCount; ++i){
  var leg = Bodies.rectangle(wheelXOffset, wheelYOffset-100, legLength, legThick,{
    collisionFilter: {group: -1},
    angle: i*2* Math.PI / legCount,
    friction: legFriction,
    restitution: legRestituion
  })
  wheelBodyLeft.push(leg); 
}

for(i=0; i<legCount; ++i){
  var leg = Bodies.rectangle(wheelXOffset+100, wheelYOffset-100, legLength, legThick,{
    collisionFilter: {group: -1},
    angle: i*2* Math.PI / legCount,
    friction: legFriction,
    restitution: legRestituion
  })

  
  wheelBodyRight.push(leg);
}



//creating actual wheels with legs inside
var wheelLeft = Matter.Body.create({ parts: wheelBodyLeft }, {collisionFilter: {group: -1}
});

var wheelRight = Matter.Body.create({ parts: wheelBodyRight}, {collisionFilter: {group: -1}  
});

//creating the constraint beteween the wheels to keep them acting as a unit
var constraint = Constraint.create({
  bodyA: wheelRight,
  bodyB: wheelLeft,  
  stiffness: 0.3,
  friction: legFriction,
  restitution: legRestituion,
  damping: 0.5,
  gravity: .0001,
  collisionFilter: {group: -1}
});


//creating a composite to add wheels, constraints to
var car = Composite.create({position: {x: 100, y: 100}});


//adding creating wheel objects, and contraints to car composite
Composite.addBody(car, wheelLeft);
Composite.addBody(car, wheelRight);
Composite.addConstraint(car, constraint);
Composite.add(engine.world, [car]);








//add obstalces
//add other terrains
//create some puzzles to solve by switching the size of wheels and vehcile in game
//torque 

//set functions  to move screen with player 
function timeOutRight(){
  if(wheelRight.position.x <= 150){    
      Render.lookAt(render, wheelRight, {
        x: 70,
        y: 210,
        padding: {x: 10, y:10},
        center: true
      
    })
}};

function timeOutLeft(){
  if(wheelLeft.position.x >= 150){  
    Render.lookAt(render, wheelLeft, {
      x: 70,
      y: 210,
      padding: {x: 10, y:10},
      center: true
    })
}};


//setInterval which allows us to call a function every set time for smooth animation
//60fps is recommended which is 16 or 17 in ms but if used it will cause a blurring effect
//when moving forward
//for now 8 seems to work better and if time I will come back and measure fps and see if we can
//optimize this a bit
setInterval(timeOutRight, 8);
setInterval(timeOutLeft, 8);



//order of things would like to see
//add to the environment such that you have to use the legs
//make slider for extension 
//redesign the robot with popup box before starting course and during course
//make wheelbase, wheelraidus, number of legs, leg lengths (but they dont get to configure just)
//configure wheelraidus which configures both

//COMPLETE pick reseaonable values current values and no more than double that in raidus and half 
//COMPLETE that in radius
//COMPLETE make slider for scaling

//select course option
//when you go to website it lets you drop into preconfigured robot
//then you go to play game in lets you get more in depth
//energy usage and now the game is can you get from here to here and use the least 
//amount of energy
//CSS grid learning for layering UI interface scrimba css grid
//after just personalize with colors but come back too

//issue of if you scale wheels all the way up and then extend legs...then scale wheels
//all the way down while the legs scale down as well there is still a big gap between
//the distane the legs are supposed to be from the circle as extended and what is
//actual possible due to this glitch




//gas for button is down right arrow key to go forward
window.addEventListener('keydown', function (e) {
        if (e.keyCode === 39){
          Body.applyForce(wheelLeft, {x: car.bodies[0].parts[1].position.x, y: car.bodies[0].parts[1].position.y}, {x: 0.001, y: 0});
          Body.applyForce(wheelRight, {x: car.bodies[1].parts[1].position.x, y: car.bodies[1].parts[1].position.y}, {x: 0.001, y: 0});
          Matter.Body.setAngularVelocity(wheelLeft, MAX_SPEED_BACKWARDS/3);
          Matter.Body.setAngularVelocity(wheelRight, MAX_SPEED_BACKWARDS/3);     
        }        
      });
//gas for button is down left arrow key to go backwards
window.addEventListener('keydown', function (e) {
         if (e.keyCode === 37){
          Body.applyForce(wheelLeft, {x: car.bodies[0].parts[1].position.x, y: car.bodies[0].parts[1].position.y}, {x: -0.001, y: 0});
          Body.applyForce(wheelRight, {x: car.bodies[1].parts[1].position.x, y: car.bodies[1].parts[1].position.y}, {x: -0.001, y: 0});
          Matter.Body.setAngularVelocity(wheelLeft, -MAX_SPEED_BACKWARDS/3);
          Matter.Body.setAngularVelocity(wheelRight, -MAX_SPEED_BACKWARDS/3);
            
    
        }});
var scale = document.getElementById("scaleWheels");
console.log(car)

//scale down 
window.addEventListener('keydown', function (e) {
    if (e.keyCode === 65){
      if(car.bodies[0].parts[1].circleRadius >= 16){
        scale.value --
        Body.scale(car.bodies[0].parts[1],  .9375,  .9375);
        Body.scale(car.bodies[1].parts[1],  .9375,  .9375);
        Body.scale(car.bodies[0].parts[2],  .9375,  .9375);
        Body.scale(car.bodies[1].parts[2],  .9375,  .9375);
        Body.scale(car.bodies[0].parts[3],  .9375,  .9375);
        Body.scale(car.bodies[1].parts[3],  .9375,  .9375);
        Body.scale(car.bodies[0].parts[4],  .9375,  .9375);
        Body.scale(car.bodies[1].parts[4],  .9375,  .9375);
        Body.scale(car.bodies[0].parts[5],  .9375,  .9375);
        Body.scale(car.bodies[1].parts[5],  .9375,  .9375);
        Body.scale(car.bodies[0].parts[6],  .9375,  .9375);
        Body.scale(car.bodies[1].parts[6],  .9375,  .9375);
        if(constraint.length >= 45){
          constraint.length = constraint.length - (constraint.length*.0625)
        };

        for (var legIdx = 2; legIdx < wheelBodyLeft.length; legIdx++) {
          var leg = wheelBodyLeft[legIdx]; 
          var legr = wheelBodyRight[legIdx];     
          // Distance between base and leg
          //vSub subtracting two vectors from each other
          //vMag returns the length of the vector
          var extension = vMag(vSub(wheelBaseLeft.position, leg.position));
          var extension = vMag(vSub(wheelBaseRight.position, legr.position));
          console.log(extension)
          
          if (extension > car.bodies[0].parts[1].circleRadius /1.3) {
              //is not matching up with length of slider
              
              extend.value--
              legExtensions[legIdx - 2] = -legExtensionMax;
              var baseAngle = wheelLeft.angle - (-leg.angle);
              var baseAngler = wheelRight.angle - (-legr.angle);
              var legOutRotated = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngle);
              var legOutRotatedr = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngler);
              Matter.Body.translate(leg, legOutRotated);
              Matter.Body.translate(legr, legOutRotatedr);
          } 
      } 
      }
      
    }
  })


//scale up
window.addEventListener('keydown', function (e) {
  if (e.keyCode === 83){
    if(car.bodies[0].parts[1].circleRadius <= 64){
      scale.value ++
      Body.scale(car.bodies[0].parts[1],  1.0625,  1.0625);
      Body.scale(car.bodies[1].parts[1],  1.0625,  1.0625);
      Body.scale(car.bodies[0].parts[2],  1.0625,  1.0625);
      Body.scale(car.bodies[1].parts[2],  1.0625,  1.0625);
      Body.scale(car.bodies[0].parts[3],  1.0625,  1.0625);
      Body.scale(car.bodies[1].parts[3],  1.0625,  1.0625);
      Body.scale(car.bodies[0].parts[4],  1.0625,  1.0625);
      Body.scale(car.bodies[1].parts[4],  1.0625,  1.0625);
      Body.scale(car.bodies[0].parts[5],  1.0625,  1.0625);
      Body.scale(car.bodies[1].parts[5],  1.0625,  1.0625);
      Body.scale(car.bodies[0].parts[6],  1.0625,  1.0625);
      Body.scale(car.bodies[1].parts[6],  1.0625,  1.0625);
      if(constraint.length <= 195){
        constraint.length = constraint.length + (constraint.length*.0625)
      };
      for (var legIdx = 2; legIdx < wheelBodyLeft.length; legIdx++) {
        var leg = wheelBodyLeft[legIdx]; 
        var legr = wheelBodyRight[legIdx];     
        // Distance between base and leg
        //vSub subtracting two vectors from each other
        //vMag returns the length of the vector
        var extension = vMag(vSub(wheelBaseLeft.position, leg.position));
        var extension = vMag(vSub(wheelBaseRight.position, legr.position));
        console.log(extension)
        
        if (extension > car.bodies[0].parts[1].circleRadius /1.3) {
            //is not matching up with length of slider
            
            extend.value--
            legExtensions[legIdx - 2] = -legExtensionMax;
            var baseAngle = wheelLeft.angle - (-leg.angle);
            var baseAngler = wheelRight.angle - (-legr.angle);
            var legOutRotated = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngle);
            var legOutRotatedr = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngler);
            Matter.Body.translate(leg, legOutRotated);
            Matter.Body.translate(legr, legOutRotatedr);
        } 
    } 

    }
  }
})

vSub = Matter.Vector.sub;
vMag = Matter.Vector.magnitude;
vRot = Matter.Vector.rotate;

var wheelSpeedMax = 0.065,
    wheelSpeed = wheelSpeedMax,
    legExtensionMax = 0.3,
    legExtensions = Array.from({ length: legCount }, (v, i) => legExtensionMax);
var extend = document.getElementById("extendWheels");

//Down arrow key for retracting legs back into wheels    
window.addEventListener('keydown', function (e) {
      if (e.keyCode === 40){        
        for (var legIdx = 2; legIdx < wheelBodyLeft.length; legIdx++) {
          var leg = wheelBodyLeft[legIdx]; 
          var legr = wheelBodyRight[legIdx]; 

          // Distance between base and leg
          //vSub subtracting two vectors from each other
          //vMag returns the length of the vector
          var extension = vMag(vSub(wheelBaseLeft.position, leg.position));
          var extension = vMag(vSub(wheelBaseRight.position, legr.position));
          
          if (extension > car.bodies[0].parts[1].circleRadius /2.5) {

              //is not matching up with length of slider
              extend.value--
              legExtensions[legIdx - 2] = -legExtensionMax;
              var baseAngle = wheelLeft.angle - (-leg.angle);
              var baseAngler = wheelRight.angle - (-legr.angle);
              var legOutRotated = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngle);
              var legOutRotatedr = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngler);
              Matter.Body.translate(leg, legOutRotated);
              Matter.Body.translate(legr, legOutRotatedr);
          } 
          // I'm not sure why the negative angle is needed below.
          // It has something to do with how matterjs represents angles internally.
          // They seemed to be left handed
          
      
          //Notes on Matter.Body.translate(body, translation)
          //Moves a body by a given vector relative to its current position, 
          //without imparting any velocity
      }     
      
      // Take a look at this later: https://gist.github.com/fabienjuif/a7d9fc3e34e23f6000bcfc185dc0e341

      // Take a look at this later: https://gist.github.com/fabienjuif/a7d9fc3e34e23f6000bcfc185dc0e341
      }});


//wheel origin will always be (0,0) in wheel frame but use world frame
//arrow key up press down to extend legs outside of wheels
var count = 0;
window.addEventListener('keydown', function (e) {
  if (e.keyCode === 38){
    for (var legIdx = 2; legIdx < wheelBodyLeft.length; legIdx++) {
      
      var leg = wheelBodyLeft[legIdx]; 
      var legr = wheelBodyRight[legIdx]; 

      // Distance between base and leg
      //vSub subtracting two vectors from each other
      //vMag returns the length of the vector
      var extension = vMag(vSub(wheelBaseLeft.position, leg.position));
      var extension = vMag(vSub(wheelBaseRight.position, legr.position))
      
      if (extension < car.bodies[0].parts[1].circleRadius/ 1.3) {
        //is not matching up with length of slider
        extend.value++;
        legExtensions[legIdx - 2] = legExtensionMax;
        var baseAngle = wheelLeft.angle - (-leg.angle);
        var baseAngler = wheelRight.angle - (-legr.angle);
        var legOutRotated = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngle);

        var legOutRotatedr = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngler);
        Matter.Body.translate(leg, legOutRotated);
        Matter.Body.translate(legr, legOutRotatedr);
    }
      // I'm not sure why the negative angle is needed below.
      // It has something to do with how matterjs represents angles internally.
      // They seemed to be left handed
  
      //Notes on Matter.Body.translate(body, translation)
      //Moves a body by a given vector relative to its current position, 
      //without imparting any velocity
  }
  
  
  // Take a look at this later: https://gist.github.com/fabienjuif/a7d9fc3e34e23f6000bcfc185dc0e341
  }});



// run the engine
Engine.run(engine); 
Engine.update(engine, delta=12.666, correction=3)
Engine.run(engine); 
//Matter.Engine.run(engine)
//An alias for Runner.run (Matter.Runner.run(engine)), see Matter.Runner for more information.
//Continuously ticks a Matter.Engine by calling Runner.tick on the requestAnimationFrame event.
    //Parameters
    //engine Engine

// run the renderer
Render.run(render);
