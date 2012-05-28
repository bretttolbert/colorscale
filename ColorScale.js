/**
 * Returns a string representation of a 2d array of numeric values
 * @param arr the 2d array
 * @param trimFloats if true, truncate fractional part with toFixed(5), then
 * remove trailing zeros (except zero following the decimal point).
 * @param outerBrackets two-element array, e.g. ['[',']']
 * @param innerBrackets two-element array, e.g. ['(',')']
 */
function repr2dArrayOfNumbers(arr, trimFloats, outerBrackets, innerBrackets) {
	var output = outerBrackets[0];
	for (var i=0; i<arr.length; ++i) {
		output += innerBrackets[0];
		for (var j=0; j<3; ++j) {
			var val = arr[i][j];
			if (trimFloats) {
				//discard insignificant fractional part
				val = val.toFixed(5);
				//strip trailing zeros
				while (val[val.length-1] == '0') {
					val = val.slice(0, val.length-1);
				}
				//zero after '.' if needed
				if (val[val.length-1] == '.') {
					val += '0';
				}
			}
			output += val;
			if (j < 2) {
				output += ',';
			}
		}
		output += innerBrackets[1];
		if (i != arr.length-1) {
			output += ',';
		}
	}
	output += outerBrackets[1];
	return output;
}

function update() {
	var numSteps = parseInt($('#numSteps').val());
	var hsvSat = parseFloat($('#hsvSat').val());
	var hsvVal = parseFloat($('#hsvVal').val());
	var minHsvHue = parseFloat($('#minHsvHue').val());
	var maxHsvHue = parseFloat($('#maxHsvHue').val());
	var reverse = $('#reverse').attr('checked');
	var outputFormat = $('#outputFormat option:selected').attr('id');
	//console.log(outputFormat);
	
	var hueSpan = maxHsvHue - minHsvHue;
	var step = hueSpan / numSteps;
	var hsv_tuples = []; //as three floating point values in range [0-1]
	var hsl_tuples = []; //as three floating point values in range [0-1]
	var rgb_tuples = []; //as three floating point values in range [0-1]
	var rgb256Tuples = []; //as three integer values in range [0-255]
	var htmlHexCodes = []; //as strings e.g. '#ffffff'
	var htmlRgb256Codes = []; //as strings e.g. 'rgb(255,255,255)'
	var htmlRgbPctCodes = []; //as strings e.g. 'rgb(100%,100%,100%)'
	var htmlHslPctCodes = []; //as string e.g. 'hsl(100%,100%,100%)'
	var x;
	if (reverse) {
		x = numSteps-1;
	} else {
		x = 0;
	}
	while (1) {
		if (reverse && x < 0) {
			break;
		} else if (!reverse && x >= numSteps) {
			break;
		}
		
		var hsv_tuple = [minHsvHue+x*step, hsvSat, hsvVal];
		var rgb_tuple = colorsys.hsv_to_rgb(hsv_tuple[0], hsv_tuple[1], hsv_tuple[2]);
		var hsl_tuple = colorsys.rgb_to_hsl(rgb_tuple[0], rgb_tuple[1], rgb_tuple[2]);
		hsv_tuples.push(hsv_tuple);
		hsl_tuples.push(hsl_tuple);
		rgb_tuples.push(rgb_tuple);

		var r256 = Math.floor(rgb_tuple[0] * 255);
		var g256 = Math.floor(rgb_tuple[1] * 255);
		var b256 = Math.floor(rgb_tuple[2] * 255);
		rgb256Tuples.push([r256,g256,b256]);
		htmlHexCodes.push('#' 
			+ r256.toString(16).zfill(2)
			+ g256.toString(16).zfill(2) 
			+ b256.toString(16).zfill(2));
		htmlRgb256Codes.push('rgb(' + r256 + ',' + g256 + ',' + b256 + ')');
		
		var r100 = Math.round(rgb_tuple[0] * 100);
		var g100 = Math.round(rgb_tuple[1] * 100);
		var b100 = Math.round(rgb_tuple[2] * 100);
		htmlRgbPctCodes.push('rgb(' + r100 + '%,' + g100 + '%,' + b100 + '%)');
		
		var h100 = Math.round(hsl_tuple[0] * 100);
		var s100 = Math.round(hsl_tuple[1] * 100);
		var l100 = Math.round(hsl_tuple[2] * 100);
		htmlHslPctCodes.push('hsl(' + h100 + '%,' + s100 + '%,' + l100 + '%)');
			
		if (reverse) {
			--x;
		} else {
			++x;
		}
	}
	var html = '';
	for (var i=0; i<htmlHexCodes.length; ++i) {
		html += '<div class="ColorSwatch" title="'+i+'\n'+htmlHexCodes[i]+'" style="background-color: '+htmlHexCodes[i]+'"></div>';
	}
	$('#colorSwatches').html(html);	
	$('.ColorSwatch').css('width', $('#swatchWidth').val());
	if ($('#swatchBorder').attr('checked')) {
		$('.ColorSwatch').css('margin-right', '1px');
		//console.log('drawing border');
	} else {
		$('.ColorSwatch').css('border-style', 'none');
		//console.log('not drawing border');
	}
	if (outputFormat == 'htmlHexLower') {
		$('#output').val(repr(htmlHexCodes));
	} else if (outputFormat == 'htmlHexUpper') {
		var upperHtmlHexCodes = [];
		for (var i=0; i<htmlHexCodes.length; ++i) {
			upperHtmlHexCodes.push(htmlHexCodes[i].toUpperCase());
		}
		$('#output').val(repr(upperHtmlHexCodes));
	} else if (outputFormat == 'htmlRgb256') {
		$('#output').val(repr(htmlRgb256Codes));
	} else if (outputFormat == 'htmlRgbPct') {
		$('#output').val(repr(htmlRgbPctCodes));
	} else if (outputFormat == 'htmlHslPct') {
		$('#output').val(repr(htmlHslPctCodes));
	} else if (outputFormat == 'pyRgb') {
		$('#output').val(repr2dArrayOfNumbers(rgb_tuples, true, ['[',']'], ['(',')']));
	} else if (outputFormat == 'pyHsl') {
		$('#output').val(repr2dArrayOfNumbers(hsl_tuples, true, ['[',']'], ['(',')']));
	} else if (outputFormat == 'pyHsv') {
		$('#output').val(repr2dArrayOfNumbers(hsv_tuples, true, ['[',']'], ['(',')']));
	} else if (outputFormat == 'cRgb') {
		var output = 'float colors[][3] = ';
		output += repr2dArrayOfNumbers(rgb_tuples, true, ['{','}'], ['{','}']);
		output += ';';
		$('#output').val(output);
	} else if (outputFormat == "javaRgb256") {
		var output = 'Color[] colors = ';
		output += repr2dArrayOfNumbers(rgb256Tuples, false, ['{',' }'], [' new Color(',')']);
		output += ';';
		$('#output').val(output);
	} else {
		$('#output').val('not implemented');
	}
}

$(function(){
	update();
	$('#numSteps').change(update);
	$('#reverse').change(update);
	$('#hsvSat').change(update);
	$('#hsvVal').change(update);
	$('#minHsvHue').change(update);
	$('#maxHsvHue').change(update);
	$('#swatchWidth').change(update);
	$('#swatchBorder').change(update);
	$('#outputFormat').change(update);
});