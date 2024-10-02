import Matter from 'matter-js';
import MatterAttractors from 'matter-attractors';
Matter.use(MatterAttractors)

const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Bodies = Matter.Bodies;

// create engine
const engine = Engine.create({
  // positionIterations: 25,
  // velocityIterations: 35
}),
world = engine.world;

// create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    background: '#000000',
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    wireframes: false,
  },
});
Render.run(render);

// create runner
const runner = Runner.create();
Runner.run(runner, engine);

// add mouse control
const mouse = Mouse.create(render.canvas)
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    length: 10,
    render: {
      visible: false
    }
  }
});

//-------------------------------------------------------//
// stuff usually changes in here
//-------------------------------------------------------//

const r = document.querySelector(':root');
const rs = getComputedStyle(r)
const colors = () => Common.choose([rs?.getPropertyValue('--primary'),rs?.getPropertyValue('--primary-dark'),rs?.getPropertyValue('--gray-dark')])

var stack = function(scale, columns, rows) {
  return Composites.stack(60, 60, columns, rows, 20, 20, function(x, y) {
    let r = () => Common.random(15, 50)
    return Bodies.circle(x, y,
      r() * scale,
      {
        friction: 0.7,
        frictionAir: 0.0001,
        frictionStatic: 0.7,
        mass: Common.random(0.1,3),
        restitution: Math.cos(r()),
        render: { fillStyle: colors() },
      });
  });
};


// const cw = render.canvas.width;
// const ch = render.canvas.height;
const cw = document.body.clientWidth;
const ch = document.body.clientHeight;

const hw = Math.floor(cw/2)
const hh = Math.floor(ch/2)

const worker = Bodies.polygon(hw, hh,
  3, 70,
  {
    plugin: {
      attractors: [
        function(bodyA, bodyB) {
          let force = {
            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
          };

          Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
          Body.applyForce(bodyB, bodyB.position, force);
        }]
    },
    friction: 1,
    restitution: 1,
    mass: 30,
    render: { fillStyle: '#AAA' }
  })

Composite.add(world, [
  stack(0.5, 5, 5),
  stack(0.3, 5, 5),
  worker,
  Bodies.rectangle(0, 0, cw*2, 30, { restitution: 1, isStatic: true, render: { visible: false } }),
  Bodies.rectangle(cw, 0, 30, ch*2, {restitution: 1,  isStatic: true, render: { visible: false }}),
  Bodies.rectangle(0, ch, cw*2, 30, {restitution: 1,  isStatic: true, render: { visible: false } }),
  Bodies.rectangle(0, 0, 30, ch*2, { restitution: 1, isStatic: true, render: { visible: false }}),
]);

const fx = (x1, r) => {
  return r * x1 * (1 - x1);
}
const it = (r) => {
  const x = 0.8
  return fx(x, r);
};

// scene animation
engine.timing.timeScale = 0.9;
engine.gravity.scale = 0.0007;

let phases = ["scared", "exertion", "dodge"]
let phase = ""
let lastPhase = ""

Events.on(engine, 'beforeUpdate', function(event) {
  let ts = engine.timing.timestamp * 0.005
  let yea = Math.floor(ts % 18) === 0;
  let cool = Math.floor(ts % 13) === 0;
  let { x, y } = worker.position
  let i = it(Common.random(-1,1))
  if (yea) {
    phase = phases[0];
    if (lastPhase !== phase) {
      Body.scale(worker, 0.45, 0.45)
      console.log(phase)
    }
    let vec = Vector.create(x, y)
    let r = Common.random(-1,1)
    let force = Vector.create(i * (Common.random(-2,2) * r), i * Common.random(-2,2) * r)
    Body.setMass(worker, 30)
    worker.render.fillStyle = "#222";
    Body.applyForce(worker, vec, force)
    lastPhase = phases[0];
  } else if (cool) {
    phase = phases[1]
    if (lastPhase !== phase) {
      Body.scale(worker, 1.4, 1.4)
      console.log(phase)
    }
    Body.setMass(worker, 10)
    worker.render.fillStyle = "white";
    Body.setAngularVelocity(worker, 5*i)
    lastPhase = phases[1];
  } else {
    phase = phases[2]
    if (lastPhase !== phase) {
      Body.scale(worker, 1.2, 1.2)
      console.log(phase)
    }
    let vec = Vector.create(x, y)
    let r = Common.random([0, 1])
    let a = Common.random(0,4)
    let b = Common.random(4,-4)
    let force = r ?
      Vector.create(i*a,i*b) : Vector.create(i*b,i*a)
    Body.setMass(worker, 70)
    worker.render.fillStyle = "#2337ff";
    Body.applyForce(worker, vec, force)
    lastPhase = phases[2];
  }
  // Math.cos(engine.timing.timestamp * 0.0005);
  //Math.sin(engine.timing.timestamp * 0.0005);
  if (!yea) {
    engine.gravity.x = Math.sin(Common.random(-1,1)) * i
    engine.gravity.y = Math.cos(Common.random(-1,1)) * i
  } else {
    engine.gravity.x = Math.sin(Common.random(-1,1)) * 0.05
    engine.gravity.y = Math.cos(Common.random(-1,1)) * 0.05
  }
});

//-------------------------------------------------------//
// till about here, stuff below generally boilerplate
//-------------------------------------------------------//

// add bodies
Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
// Render.lookAt(render, Composite.allBodies(world));

// fit the render viewport to the scene
// Render.lookAt(render, {
//     min: { x: 0, y: 0 },
//     max: { x: cw, y: ch }
// });

// update viewport on resize
// TODO: add a debounce
// TODO: update @types/matter-js with patch for latest jsdoc?
// would be nice to use TS here for hinting..
window.addEventListener('resize', () => {
  Render.setSize(render, document.body.clientWidth, document.body.clientHeight);
})
