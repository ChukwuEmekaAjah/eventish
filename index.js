var eventEmmitter = require('events');
var utils = require('./utils/utils');

var Emitter = new eventEmmitter.EventEmitter();
Emitter.setMaxListeners(0);
var event_names = [];

// check for an arry of handlers or single handler
/*
	@setEvent can receive two args: an event and a handler or array of handlers
	@setEvent can receive one argument: an object of events mapped to their handlers (either single handler or array of handlers);
	@setEvent can receive two arguments: an array of events and a handler
	@triggerEvent can receive two args: an event and the data to be passed on to it; event of type string and data of type object;
	@triggerEvent can one single argument: object of events and the corresponding object of data;
	@triggerEvent can have one single argument: an array of events without data passed to it;
	@triggerEvent can have one single argument: a string of the event name
*/



function setEvent(){
	var args = arguments;
	console.log(args);
	switch(args.length){
		case 0:
			console.error(new Error("You must provide at least one object argument to set an event"));
			return new Error("You must provide one object argument to set an event");
		case 1:
			// check to see if its an object;
			var is_object = utils.is_object(args[0]);
			if(is_object){
				// get the events that are being set as an array
				var events = Object.keys(args[0]);
				events.forEach(function(event){
					// check to see if the handler is an array of functions or a function
					if(utils.is_array(args[0][event])){
						// check to see that all the listeners are functions
						var event_listeners = args[0][event].every(function(listener){
							if(utils.is_function(listener))
								return true;
						})
						if(event_listeners){
							// now we add the listeners to the event they correspond to
							var listeners = args[0][event];
							listeners.forEach(function(listener){
								Emitter.on(event,listener);
								utils.add_event(event_names,event);
							})
						}
						else{
							console.error(new Error("all members of array must be functions"))
							return new Error('all members of array must be functions');
						}
					}
					else if(utils.is_function(args[0][event])){
						// only one function was sent across
						var listener = args[0][event];
						Emitter.on(event,listener);
						utils.add_event(event_names, event);
					}
					else{
						// the event value is neither of type array of functions or array
						console.error(new Error("event listener must be of function type"))
						return new Error("event listeners must be a function or array of functions");
					}
				})
			}
			break;
		case 2:
			// either an event and a function or event and array of functions;
			if(utils.is_string(args[0])){
				var event = args[0];
				// now we check if the second argument is an array of functions or just a funtion
				if(utils.is_function(args[1])){
					// it is a function, then we set the event
					var listener = args[1]
					Emitter.on(event,listener);
					utils.add_event(event_names, event);
				}
				else if(utils.is_array(args[1])){
					// we check to see if it is an array;
					var listeners = args[1];
					// we test to see if they are all functions
					var function_test = listeners.every(function(listener){
						if(utils.is_function(listener))
							return true;
					})
					if(function_test){
						// if they are all functions then we add them to the event
						listeners.forEach(function(listener){
							Emitter.on(event,listener);
							utils.add_event(event_names, event);
						})
					}
					else{
						console.error(new Error("Listeners must be of function type"));
						return new Error("Listeners must be of function type");
					}
				}
				else{
					console.error(new Error("Listeners must be of function type"));
					return new Error("Listeners must be of function type")
				}
			}
			else if(utils.is_array(args[0])){
				// a case where one callback function is called for a series of events
				var events = args[0];
				var listener = utils.is_function(args[1]) ? args[1] : false;
				if(listener){
					var valid_events = events.every(function(event){
						if(utils.is_string(event)){
							return true;
						}
					})

					if(valid_events){
						events.forEach(function(event){
							Emitter.on(event,listener);
							utils.add_event(event_names,event);
						})
					}
					else{
						console.error(new Error("Events must be of string type"));
						throw new Error("Listeners must be of function type");
					}
				}
				else{
					console.error(new Error("Listeners must be of function type"))
					throw new Error("Listeners must be of function type")
				}
			}
			else{
				console.error(new Error("event name must be of valid string type"));
			}
	}
}

function triggerEvent(){
	var args = arguments
	switch(args.length){
		case 0:
			console.error(new Error("There must be a valid event name"));
			return new Error("There must be a valid event name");
		case 1:
			if(utils.is_string(args[0])){
				// the user just passed in an event without data to be manipulated on
				var event = args[0]
				if(utils.check_event(event_names,event)){
					Emitter.emit(event);
				}
			}
			else if(utils.is_array(args[0])){
				// array of events to be triggered on after the other;
				var events = args[0];
				// we would check if they are all strings;
				var are_strings = events.every(function(event){
					if(utils.is_string(event)){
						return true;
					}
				})

				if(are_strings){
					// we now emit the events in order
					events.forEach(function(event){
						if(utils.check_event(event_names,event)){
							Emitter.emit(event);
						}
						else{
							console.error(new Error("Event "+event+" is not registered"));
						}
					})
				}
				else{
					console.error(new Error("Event names must be of type string"));
					throw new Error("Event names must be of type string");
				}
			}
			else if(utils.is_object(args[0])){
				// object of events and their corresponding data values on emit;
				var events = Object.keys(args[0]);
				events.forEach(function(event){
					if(utils.check_event(event_names,event)){
						// if there is no data, input an empty string or array or object
						var event_data = args[0][event];
						Emitter.emit(event, event_data);
					}
				});
			}
			else{
				console.error(new Error("triggerEvent method receives any of string, array or object types"));
				throw new Error("triggerEvent method receives any of string, array or object types");
			}
		case 2:
			if(utils.is_string(args[0])){
				var event = args[0];
				if(utils.check_event(event_names,event)){
					var event_data = args[1];
					Emitter.emit(event, event_data);
				}
				else{
					console.error(new Error("Event "+event+" is not registered"));
					throw new Error("Event "+event+" is not registered");
				}
			}
			else{
				console.error(new Error("triggerEvent method needs event type to be of string type"));
				throw new Error("triggerEvent method needs event type to be of string type");
			}
	}
}

module.exports = {
	setEvent:setEvent,
	triggerEvent:triggerEvent,
};