function utils(){
	/*
		holds the utility functions needed for setting and emitting events
	*/
	function is_object(param){
		if(Object.prototype.toString.call(param) == "[object Object]" || param.constructor == Object){
			return true;
		}
		return false;
	}

	function is_array(param){
		if(Object.prototype.toString.call(param) == "[object Array]" || param.constructor == Array){
			return true;
		}
		return false;
	}

	function is_string(param){
		if(typeof(param) == "string" || Object.prototype.toString.call(param) == "[object String]"){
			return true;
		}
		return false;
	}

	function is_function(param){
		if(typeof(param) == "function" || Object.prototype.toString.call(param) == "[object Function]"){
			return true;
		}
		return false;
	}

	function add_event(events,event){
		if(events.indexOf(event) == -1){
			events.push(event);
		}
	}

	function check_event(events,event){
		if(events.indexOf(event) > -1){
			return true;
		}
	}

	return{
		is_array:is_array,
		is_object:is_object,
		is_string:is_string,
		is_function:is_function,
		add_event:add_event,
		check_event:check_event,
	}
}

module.exports = utils();