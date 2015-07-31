
var FRICTION = .95;
var TEXT_OFFSET = 80;
var SELECTED_COLOR = "rgba(0,255,0,0.25)";

var stage;
var wheel;
var section_container;
var sections = [];
var restaurants = [];

var spinSpeed = 0;
var spinDirection = 0;
var section_arc;
var selected_shape;
var cur_selected_section_id;

var mouseX;
var mouseY;
var mouseSpeed;

function initWheel(){
	stage = new createjs.Stage("wheel-canvas");
	wheel = new createjs.Container();
	section_container = new createjs.Container();
	wheel.addChild(section_container);

	var circle = new createjs.Shape();

	/* outlines */
	circle.graphics.setStrokeStyle(1).beginStroke("#000").drawCircle(0,0,200).endStroke();
	circle.graphics.setStrokeStyle(1).beginStroke("#000").beginFill("#fff").drawCircle(0,0,50).endStroke().endFill();

	wheel.addChild(circle);

	wheel.x = 250;
	wheel.y = 250;

	stage.addChild(wheel);

	// pointer
	var pointer = new createjs.Shape();
	pointer.graphics.beginFill("#000").lineTo(-10,-20).lineTo(10,-20).lineTo(0,0);
	stage.addChild(pointer);
	pointer.x = 250;
	pointer.y = 60;

	// mouse events
	wheel.addEventListener("mousedown", function(evt){
		mouseX = evt.stageX;
		mouseY = evt.stageY;
	});

	wheel.addEventListener("pressmove", function(evt){
		var dX = evt.stageX - mouseX;
		mouseX = evt.stageX;
		mouseSpeed = dX * .5;
		wheel.rotation += mouseSpeed;
		updateWheelSelection();
	});

	wheel.addEventListener("pressup", function(evt){
		if (Math.abs(mouseSpeed) > 1) startSpin(mouseSpeed);
	});

	// frame ticker
	createjs.Ticker.addEventListener("tick", handleTick);
	function handleTick(event) {
	    // Actions carried out each tick (aka frame)

	    if (!event.paused && sections.length) {
		    wheel.rotation += spinSpeed * spinDirection;

		    // check rotation to determine active section
		    if(spinSpeed > 0){
				updateWheelSelection();
			    
			    if(spinSpeed > .01){
			    	spinSpeed *= FRICTION;
			    }else{
			    	onStopSpin();
			    }
		    }

	    }
	    stage.update();
	}
}

function startSpin(spd){
	spinDirection = spd < 0 ? -1 : 1;
	spinSpeed = Math.abs(spd);
}

function onStopSpin(){
	spinSpeed = 0;
	console.log("[onStopSpin] WINNER: " + restaurants[cur_selected_section_id].name);
}

function createSections(rest_arr){
	restaurants = rest_arr;
	// remove old sections
	for(var i = 0; i < sections.length; i++){
		section_container.removeChild(sections[i]);
	}
	var text;
	var bg;
	sections = [];
	for(i = 0; i < restaurants.length; i ++){
		sections[i] = new createjs.Container(); 
		// color background
		var section_color = i % 2 ? "#eee" : "#ddd";
		var angle = ((Math.PI * 2) / restaurants.length) * .5;
		bg = new createjs.Shape();
		bg.graphics.beginFill(section_color).arc(0, 0, 200, angle * -1, angle);
		bg.graphics.lineTo(0,0);
		sections[i].addChildAt(bg, 0);

		// text
		text = new createjs.Text(restaurants[i].name, "12px Arial", "#000");
		text.lineWidth = 105;
		text.x = TEXT_OFFSET;
		text.y = text.getBounds().height * -.5;
		sections[i].addChildAt(text, 1);
		sections[i].rotation = (i * (360/restaurants.length)) + (angle * (180/Math.PI) - 90);;

		section_container.addChild(sections[i]);
	}

	// created selected shape
	selected_shape = new createjs.Shape();
	selected_shape.graphics.beginFill(SELECTED_COLOR).arc(0, 0, 200, angle * -1, angle);
	selected_shape.graphics.lineTo(0,0);
	section_arc = (angle * 2) * (180/Math.PI);
}

function updateWheelSelection(){
	var wheel_angle = wheel.rotation % 360;
	var section_id = 0;

	if(wheel_angle < 0){
		section_id = Math.abs(Math.floor(wheel_angle/section_arc)) - 1;
	}else{
		section_id = (sections.length - 1) - Math.floor(wheel_angle/section_arc);
	}

	if(sections[cur_selected_section_id]){
		sections[cur_selected_section_id].removeChildAt(1);
	}
	sections[section_id].addChildAt(selected_shape, 1);
	cur_selected_section_id = section_id;
}
