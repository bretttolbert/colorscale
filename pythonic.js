//##
//# pythonic
//#   a javascript library to make javascript more pythonic
//##

var random = { 
	//same as python random.randint() function
	//returns random integer between lower (inclusive) and upper (inclusive)
	randint: function(lower,upper) {
		return Math.floor((upper-lower+1)*Math.random()) + lower;
	},

	//same as python random.choice() function
	//returns randomly chosen element from an array
	// Tip: get random key from object:
	// random.choice(obj.keys());
	choice: function(list) {
		return list[random.randint(0,list.length-1)];
	},

	//same as python random.shuffle() runction
	//takes and array and shuffles its elements
	shuffle: function(list) {
		//for a list of size n, it shuffles the list by performing n random swaps
		for (var i=0; i<list.length; i++){
			var temp = list[i];
			var swap_index = random.randint(0,list.length-1);
			list[i] = list[swap_index];
			list[swap_index] = temp;
		}
	}
}

//similar to python range, but only takes one argument
//returns array with the natural numbers from 0 (inclusive) to n (exclusive)
function range(n) {
    result = new Array()
    for (var i=0; i<n; i++)
        result.push(i);
    return result;
}

//same as python len()
function len(list) {
    return list.length;
}

//converts an array to a string representation
//meant to be used for debugging and such
function repr(list) {
    var s = "[";
    for (var i=0; i<list.length-1; i++)
        s += "'" + list[i] + "', ";
    s += "'" + list[list.length-1] + "']";
    return s;
}

String.prototype.zfill = function (width) {
	var str = '' + this;
	while (str.length < width) {
		str = '0' + str;
	}
	return str;
}