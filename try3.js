// module aliases
var Engine = Matter.Engine, //this assigns a new engine to Engine to manage simulation
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
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
var sceneWidth = 800;
var wheelRadius = 32;
var legThick = 10;
var legLength = wheelRadius;

var legCount = 5;
var legFriction = 0.1;
var legRestituion = 0.1;
const cust_Path = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'

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
        width: sceneWidth
    }
});

var ground = Bodies.rectangle(400, 410, sceneWidth, 60, { isStatic: true });


var svgs = [
  'download'
];
var vertexSets = [];

for (var i = 0; i < svgs.length; i += 1) {
  (function(i) {
      $.get('./svg/' + svgs[i] + '.svg').done(function(data) {
              var color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);

          $(data).find('path').each(function(i, path) {
              var points = Svg.pathToVertices(path, 30);
              vertexSets.push(Vertices.scale(points, 0.4, 0.4));
          });
          World.add(engine.world, [ground, Bodies.fromVertices(100 + i * 150, 200 + i * 50, vertexSets, {
              render: {
                  fillStyle: color,
                  strokeStyle: color,
                  lineWidth: 1
              }
          }, true)]);
      });
  })(i);
}
/*
const PATHS = {
  DOME: '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0 0 0'};

  	// bodies created from SVG paths
	function path(x, y, path) {
		let vertices = Matter.Vertices.fromPath(path);
		return Matter.Bodies.fromVertices(x, y, vertices, {
			isStatic: true,
			render: {
				lineWidth: 1
			}
		});
	}

/*var arrow = Vertices.fromPath('40 0 40 20 100 20 100 80 40 80 40 100 0 50'),
chevron = Vertices.fromPath('100 0 75 50 100 100 25 100 0 50 25 0'),
star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'),
horseShoe = Vertices.fromPath('35 7 19 17 14 38 14 58 25 79 45 85 65 84 65 66 46 67 34 59 30 44 33 29 45 23 66 23 66 7 53 7');

var stack = Composites.stack(50, 50, 6, 4, 10, 10, function(x, y) {
  var color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);
  return Bodies.fromVertices(x, y, Common.choose([arrow, chevron, star, horseShoe]), {
      render: {
          fillStyle: color,
          strokeStyle: color,
          lineWidth: 1
      }
  }, true);
});*/

//var terrain;

   // var data = document.getElementById('svg8')
    //console.log(data)
    
    /*function(data) {
        var vertexSets = [];

        $(data).find('path').each(function(i, path) {
            vertexSets.push(Svg.pathToVertices(path, 30));
        });

        terrain = Bodies.fromVertices(400, 350, vertexSets, {
            isStatic: true,
            render: {
                fillStyle: '#2e2b44',
                strokeStyle: '#2e2b44',
                lineWidth: 1
            }
        }, true)};*/



//var tryy = Body.create({position: {x: 100, y:0}}, {vertices: terr}, {isStatic: true});
//var tryy = Bodies.fromVertices(10, 100, terr);

//console.log(tryy)

/*var concavePolygon = [
  [ -1,   1],
  [ -1,   0],
  [  1,   0],
  [  1,   1],
  [0.5, 0.5]
];

decomp.makeCCW(concavePolygon);
var convexPolygons = decomp.quickDecomp(concavePolygon);
console.log(convexPolygons);
var vert = Matter.Body.create()

var b = Matter.Body.setVertices(vert, convexPolygons);
console.log(b)*/

//var ground = Bodies.rectangle(400, 410, sceneWidth, 60, { isStatic: true });
//World.add(engine.world, [ground])  //path(239, 86, PATHS.DOME)]
//console.log(decomp)




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

var wheelLeft = Matter.Body.create({ parts: wheelBodyLeft });
//Composite.add(engine.world, wheelLeft);
var wheelRight = Matter.Body.create({ parts: wheelBodyRight});
//Composite.add(engine.world, wheelRight);

//var ki = Matter.Constraint.create({bodyA: wheelBodyLeft, pointA: {x: 30, y: 30}, bodyB: wheelBodyRight, pointB: {x: 50, y: 30}})
//console.log(ki)

car = Composite.create();
//Composite.addConstraint(car, ki);
Composite.addBody(car, wheelRight);
Composite.addBody(car, wheelLeft);

World.add(engine.world, [car]);

//try to fix legs going into ground so much look at making composite where create wheel with legs etc


/*for(i=2; i < legCount+2; i++){
  console.log(car.bodies[0].parts[i])
  console.log(car.bodies[0].parts[i].position.x + 20)
}*/

//Matter.World.addBody(world, body)
//Is this saying you have a world and you add a body to it
//so in the above my car is the world and the bodies being added to it are WL and WR


//SO this is a problem I've had for a while with this project.  If you already have 
//wheelBodyLeft as consisting of an arrary then when you add parts you cannot add more 
//than one because you can only add multiple through an array and if you put wheelBodyLeft
// and wheelBodyRight like parts: [wheelBodyLeft, wheelBodyRight] you get undefined errors
//because you give parts a 2d array when it expects at most one array
//This causes parts or how I have it now wheelLeft and WheelRight to not look connected
//if you have them as parts: [wheelBodyLeft, wheelBodyRight] you would see a line connecting them
//Its not appending to parts its just putting the body into the object


var travel = document.getElementById("force");
travel.addEventListener("click", function () {
    
    Matter.Body.setAngularVelocity(wheelLeft, wheelSpeed);
    Matter.Body.setAngularVelocity(wheelRight, wheelSpeed);
    
});


var travel = document.getElementById("vforce");
travel.addEventListener("click", function () {
   
    Matter.Body.setAngularVelocity(wheelLeft, -wheelSpeed);
    Matter.Body.setAngularVelocity(wheelRight, -wheelSpeed);
    
});

vSub = Matter.Vector.sub;
vMag = Matter.Vector.magnitude;
vRot = Matter.Vector.rotate;

var wheelSpeedMax = 0.1,
    wheelSpeed = wheelSpeedMax,
    legExtensionMax = 0.3,
    legExtensions = Array.from({ length: legCount }, (v, i) => legExtensionMax);

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
    
    if (extension > wheelRadius /2.5) {
        legExtensions[legIdx - 2] = -legExtensionMax;
        var baseAngle = wheelLeft.angle - (-leg.angle);
        var legOutRotated = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngle);
        Matter.Body.translate(leg, legOutRotated);
        Matter.Body.translate(legr, legOutRotated);
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


var retract= document.getElementById("retract");
retract.addEventListener('click', function(){
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
      var legOutRotated = vRot({x: legExtensions[legIdx - 2], y: 0}, baseAngle);
      Matter.Body.translate(leg, legOutRotated);
      Matter.Body.translate(legr, legOutRotated);
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
