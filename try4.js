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

// create an engine
var sceneHeight = 400;
var additional = 500;
var sceneWidth = 800;
var wheelRadius = 32;
var legThick = 10;
var legLength = wheelRadius;

var legCount = 5;
var legFriction = 0.1;
var legRestituion = 0.1;

var sceneCenter = sceneWidth / 2,
sceneMiddle = sceneHeight / 2,
wheelYOffset = sceneHeight - wheelRadius * 2,
wheelXOffset = sceneCenter;

var engine = Engine.create(); //here created a new engine controller to manage the simulation based on
//default settings since no options object is passed into create([options]) - which is found
//under properities of documentation

// create a renderer
var render = Render.create({
    element: document.body, //this is saying to stick the canvas in the html body will show
    //canvas creation in elements under inspect //why don't i need to have it be render.element
    //like in the documentation because render.element render is just the name of the variable to 
    //which the element will be assigned to
    engine: engine, //A reference to the Matter.Engine instance to be used.
    options:{
        showAngleIndicator: false,
        showAxes: false,
        showConvexHulls: false,
        anchors: false,
        height: sceneHeight,
        width: sceneWidth,
        hasBounds: true
    }
});

var ground = Bodies.rectangle(400, 410, sceneWidth, 60, { isStatic: true });

var svgs = [
  'cash',
  'cash',
  'cash',
  'cash',
];
var vertexSets = [];

for (var i = 0; i < svgs.length; i += 1) {
  (function(i) { //I had to remove the period in the .svg line to get it to grab the img
    //otherwise it put a space between / .svg/download.svg
      $.get('/svg/' + svgs[i] + '.svg').done(function(data) {
              var color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

          $(data).find('path').each(function(i, path) {
              var points = Svg.pathToVertices(path, 15);
              vertexSets.push((points));
          });

        World.add(engine.world, [ground, Bodies.fromVertices(400+10*i, 300, vertexSets, {
              render: {
                  fillStyle: color,
                  strokeStyle: color,
                  lineWidth: 1
              }
          }, true)]);
      });
  })(i);
}

var wheelBaseLeft = Bodies.circle(wheelXOffset, wheelYOffset, wheelRadius,{
  collisionFilter: {group: -1}

});

var wheelBaseRight = Bodies.circle(wheelXOffset+ 100, wheelYOffset, wheelRadius,{
  collisionFilter: {group: -1}
});

var wheelBodyLeft = [wheelBaseLeft];
var wheelBodyRight = [wheelBaseRight];



for(i=0; i<legCount; ++i){
  var leg = Bodies.rectangle(wheelXOffset, wheelYOffset, legLength, legThick,{
    collisionFilter: {group: -1},
    angle: i*2* Math.PI / legCount,
    friction: legFriction,
    restitution: legRestituion
  })
  wheelBodyLeft.push(leg); //how does this know to append to parts?
}

for(i=0; i<legCount; ++i){
  var leg = Bodies.rectangle(wheelXOffset+100, wheelYOffset, legLength, legThick,{
    collisionFilter: {group: -1},
    angle: i*2* Math.PI / legCount,
    friction: legFriction,
    restitution: legRestituion
  })
  wheelBodyRight.push(leg);
}

//var wheelLeft = Composite.create();
//Composite.addBody(wheelLeft, wheelBodyLeft);

var wheelLeft = Matter.Body.create({ parts: wheelBodyLeft }, {collisionFilter: {group: -1}
});
//Composite.add(engine.world, wheelLeft);
var wheelRight = Matter.Body.create({ parts: wheelBodyRight}, {collisionFilter: {group: -1},
  
});
//Composite.add(engine.world, wheelRight);

var constraint = Constraint.create({
  bodyA: wheelRight,
  bodyB: wheelLeft,  
  stiffness: 0.003,
  damping: 0.05,
  collisionFilter: {group: -1}
});


//car = Composite.create();
//Composite.addConstraint(car, ki);
//Composite.addBody(car, wheelRight);
//Composite.addBody(car, wheelLeft);



World.add(engine.world, [wheelLeft, wheelRight, constraint]);

//try to fix legs going into ground so much look at making composite where create wheel with legs etc

var travel = document.getElementById("force");
travel.addEventListener("click", function () {
    
    Matter.Body.setAngularVelocity(wheelLeft, wheelSpeed);
    Matter.Body.setAngularVelocity(wheelRight, wheelSpeed);
      
    
});


var travel = document.getElementById("vforce");
travel.addEventListener("click", function () {
  console.log(ground)
   
    Matter.Body.setAngularVelocity(wheelLeft, -wheelSpeed);
    Matter.Body.setAngularVelocity(wheelRight, -wheelSpeed);
    if(wheelLeft.position.x < 150){
      let translate = {x : -ground.position.x/4, y : 0}
      Bounds.translate(render.bounds, translate);
      Matter.Body.translate(ground, {x: -20, y:0 });
     
    }
    
  
    
});
if(wheelLeft.position.x < 150){
  console.log("hello")
  Matter.Body.translate(wheelBaseRight, -0.1);
}


vSub = Matter.Vector.sub;
vMag = Matter.Vector.magnitude;
vRot = Matter.Vector.rotate;

var wheelSpeedMax = 0.07,
    wheelSpeed = wheelSpeedMax,
    legExtensionMax = 0.3,
    legExtensions = Array.from({ length: legCount }, (v, i) => legExtensionMax);

var retract = document.getElementById("retract");
retract.addEventListener('click', function(){
  for (var legIdx = 2; legIdx < wheelBodyLeft.length; legIdx++) {
    var leg = wheelBodyLeft[legIdx]; 
    var legr = wheelBodyRight[legIdx];     
    // Distance between base and leg
    //vSub subtracting two vectors from each other
    //vMag returns the length of the vector
    var extension = vMag(vSub(wheelBaseLeft.position, leg.position));
    var extension = vMag(vSub(wheelBaseRight.position, legr.position));
    
    if (extension > wheelRadius /2.5) {
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
})
//Composite.add(engine.world, [car]); //here engine.world is a composite type
// add all of the bodies to the world

//wheel origin will always be (0,0) in wheel frame but use world frame


var extend = document.getElementById("extend");
extend.addEventListener('click', function(){
  for (var legIdx = 2; legIdx < wheelBodyLeft.length; legIdx++) {
    var leg = wheelBodyLeft[legIdx]; 
    var legr = wheelBodyRight[legIdx];     
    // Distance between base and leg
    //vSub subtracting two vectors from each other
    //vMag returns the length of the vector
    var extension = vMag(vSub(wheelBaseLeft.position, leg.position));
    var extension = vMag(vSub(wheelBaseRight.position, legr.position));
    
    if (extension < wheelRadius / 1.3) {
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
})
//Composite.add(engine.world, [car]); //here engine.world is a composite type
// add all of the bodies to the world

// run the engine
Engine.run(engine); 
//Matter.Engine.run(engine)
//An alias for Runner.run (Matter.Runner.run(engine)), see Matter.Runner for more information.
//Continuously ticks a Matter.Engine by calling Runner.tick on the requestAnimationFrame event.
    //Parameters
    //engine Engine

// run the renderer
Render.run(render);
