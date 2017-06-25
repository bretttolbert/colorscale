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

function join(arr, delim) {
    var str = '';
    for (var i=0; i<arr.length; ++i) {
        str += arr[i];
        if (i != arr.length-1) {
            str += delim;
        }
    }
    return str;
}

function update() {
    var numSteps = parseInt($('#numSteps').val());
    var minHsvHue = parseFloat($('#minHsvHue').val());
    var maxHsvHue = parseFloat($('#maxHsvHue').val());
    var minHsvSat = parseFloat($('#minHsvSat').val());
    var maxHsvSat = parseFloat($('#maxHsvSat').val());
    var minHsvVal = parseFloat($('#minHsvVal').val());
    var maxHsvVal = parseFloat($('#maxHsvVal').val());
    $('#hueSlider').slider('values',0,minHsvHue*1000);
    $('#hueSlider').slider('values',1,maxHsvHue*1000);
    $('#satSlider').slider('values',0,minHsvSat*1000);
    $('#satSlider').slider('values',1,maxHsvSat*1000);
    $('#valSlider').slider('values',0,minHsvVal*1000);
    $('#valSlider').slider('values',1,maxHsvVal*1000);
    var reverse = $('#reverse').is(':checked');
    var outputFormat = $('#outputFormat option:selected').attr('id');
    //console.log(outputFormat);
    
    var hueSpan = maxHsvHue - minHsvHue;
    var hueStep = hueSpan / numSteps;
    var satSpan = maxHsvSat - minHsvSat;
    var satStep = satSpan / numSteps;
    var valSpan = maxHsvVal - minHsvVal;
    var valStep = valSpan / numSteps;
    var hsv_tuples = []; //as three floating point values in range [0-1]
    var hsl_tuples = []; //as three floating point values in range [0-1]
    var rgb_tuples = []; //as three floating point values in range [0-1]
    var rgb256Tuples = []; //as three integer values in range [0-255]
    var htmlHexCodesLower = []; //as strings e.g. '#ffffff'
    var htmlHexCodesUpper = []; //e.g. '#FFFFFF'
    var htmlRgb256ArrayCodes = []; //as strings e.g. 'rgb(255,255,255)'
    var htmlRgbPctArrayCodes = []; //as strings e.g. 'rgb(100%,100%,100%)'
    var htmlHslPctArrayCodes = []; //as string e.g. 'hsl(100%,100%,100%)'
    var x;
    if (reverse) {
        console.log('reverse=true');
        x = numSteps-1;
    } else {
        console.log('reverse=false');
        x = 0;
    }
    while (1) {
        if (reverse && x < 0) {
            break;
        } else if (!reverse && x >= numSteps) {
            break;
        }
        
        var hsv_tuple = [minHsvHue+x*hueStep, minHsvSat+x*satStep, minHsvVal+x*valStep];
        var rgb_tuple = colorsys.hsv_to_rgb(hsv_tuple[0], hsv_tuple[1], hsv_tuple[2]);
        var hsl_tuple = colorsys.rgb_to_hsl(rgb_tuple[0], rgb_tuple[1], rgb_tuple[2]);
        hsv_tuples.push(hsv_tuple);
        hsl_tuples.push(hsl_tuple);
        rgb_tuples.push(rgb_tuple);

        var r256 = Math.floor(rgb_tuple[0] * 255);
        var g256 = Math.floor(rgb_tuple[1] * 255);
        var b256 = Math.floor(rgb_tuple[2] * 255);
        rgb256Tuples.push([r256,g256,b256]);
        var hexCodeLower = '#' 
            + r256.toString(16).zfill(2)
            + g256.toString(16).zfill(2) 
            + b256.toString(16).zfill(2);
        htmlHexCodesLower.push(hexCodeLower);
        htmlHexCodesUpper.push(hexCodeLower.toUpperCase());
        htmlRgb256ArrayCodes.push('rgb(' + r256 + ',' + g256 + ',' + b256 + ')');
        
        var r100 = Math.round(rgb_tuple[0] * 100);
        var g100 = Math.round(rgb_tuple[1] * 100);
        var b100 = Math.round(rgb_tuple[2] * 100);
        htmlRgbPctArrayCodes.push('rgb(' + r100 + '%,' + g100 + '%,' + b100 + '%)');
        
        var h100 = Math.round(hsl_tuple[0] * 100);
        var s100 = Math.round(hsl_tuple[1] * 100);
        var l100 = Math.round(hsl_tuple[2] * 100);
        htmlHslPctArrayCodes.push('hsl(' + h100 + '%,' + s100 + '%,' + l100 + '%)');
            
        if (reverse) {
            --x;
        } else {
            ++x;
        }
    }
    var html = '';
    for (var i=0; i<htmlHexCodesLower.length; ++i) {
        html += '<div class="color-swatch" title="'+i+'\n'+htmlHexCodesLower[i]+'" style="background-color: '+htmlHexCodesLower[i]+'"></div>';
    }
    $('#colorSwatches').html(html); 
    $('.color-swatch').css('width', $('#swatchWidth').val());
    $('.color-swatch').css('height', $('#swatchHeight').val());
    if ($('#swatchBorder').attr('checked')) {
        $('.color-swatch').css('margin-right', '1px');
        $('.color-swatch').css('margin-bottom', '1px');
        //console.log('drawing border');
    } else {
        $('.color-swatch').css('margin-right', '0px');
        $('.color-swatch').css('margin-bottom', '0px');
        //console.log('not drawing border');
    }
    if ($('#swatchAlign option:selected').attr('id') == 'vertical') {
        $('.color-swatch').css('float', 'none');
    } else if ($('#swatchAlign option:selected').attr('id') == 'horizontal') {
        $('.color-swatch').css('float', 'left');
    } else {
        throw('Error: invalid swatchAlign');
    }
    if (outputFormat == 'htmlHexLowerArray') {
        $('#output').val(repr(htmlHexCodesLower));
    } else if (outputFormat == 'htmlHexLowerOnePerLine') {
        $('#output').val(join(htmlHexCodesLower, '\n'));
    } else if (outputFormat == 'htmlHexUpperArray') {
        $('#output').val(repr(htmlHexCodesUpper));
    } else if (outputFormat == 'htmlHexUpperOnePerLine') {
        $('#output').val(join(htmlHexCodesUpper, '\n'));
    } else if (outputFormat == 'htmlRgb256Array') {
        $('#output').val(repr(htmlRgb256ArrayCodes));
    } else if (outputFormat == 'htmlRgb256OnePerLine') {
        $('#output').val(join(htmlRgb256ArrayCodes, '\n'));
    } else if (outputFormat == 'htmlRgbPctArray') {
        $('#output').val(repr(htmlRgbPctArrayCodes));
    } else if (outputFormat == 'htmlRgbPctOnePerLine') {
        $('#output').val(join(htmlRgbPctArrayCodes, '\n'));
    } else if (outputFormat == 'htmlHslPctArray') {
        $('#output').val(repr(htmlHslPctArrayCodes));
    } else if (outputFormat == 'htmlHslPctOnePerLine') {
        $('#output').val(join(htmlHslPctArrayCodes, '\n'));
    } else if (outputFormat == 'pyRgbList') {
        $('#output').val(repr2dArrayOfNumbers(rgb_tuples, true, ['[',']'], ['(',')']));
    } else if (outputFormat == 'pyHslList') {
        $('#output').val(repr2dArrayOfNumbers(hsl_tuples, true, ['[',']'], ['(',')']));
    } else if (outputFormat == 'pyHsvList') {
        $('#output').val(repr2dArrayOfNumbers(hsv_tuples, true, ['[',']'], ['(',')']));
    } else if (outputFormat == 'cRgbArray') {
        var output = 'float colors[][3] = ';
        output += repr2dArrayOfNumbers(rgb_tuples, true, ['{','}'], ['{','}']);
        output += ';';
        $('#output').val(output);
    } else if (outputFormat == "javaRgb256Array") {
        var output = 'Color[] colors = ';
        output += repr2dArrayOfNumbers(rgb256Tuples, false, ['{',' }'], [' new Color(',')']);
        output += ';';
        $('#output').val(output);
    } else {
        $('#output').val('not implemented');
    }
}

$(function(){
    $('#hueSlider').slider({
        min: 0,
        max: 1000,
        values: [0, 850],
        slide: function(event, ui) {
            var min = parseFloat($(this).slider('values', 0)) / 1000;
            $('#minHsvHue').val(min);
            var max = parseFloat($(this).slider('values', 1)) / 1000;
            $('#maxHsvHue').val(max);
            update();
        }
    });
    $('#satSlider').slider({
        min: 0,
        max: 1000,
        values: [600, 600],
        slide: function(event, ui) {
            var min = parseFloat($(this).slider('values', 0)) / 1000;
            $('#minHsvSat').val(min);
            var max = parseFloat($(this).slider('values', 1)) / 1000;
            $('#maxHsvSat').val(max);
            update();
        }
    });
    $('#valSlider').slider({
        min: 0,
        max: 1000,
        values: [900, 900],
        slide: function(event, ui) {
            var min = parseFloat($(this).slider('values', 0)) / 1000;
            $('#minHsvVal').val(min);
            var max = parseFloat($(this).slider('values', 1)) / 1000;
            $('#maxHsvVal').val(max);
            update();
        }
    });
    update();
    $('#numSteps').change(update);
    $('#numStepsDecr').click(function(){
        $('#numSteps').val("" + (parseInt($('#numSteps').val()) - 1));
        update();
    });
    $('#numStepsIncr').click(function(){
        $('#numSteps').val("" + (parseInt($('#numSteps').val()) + 1));
        update();
    });
    $('#reverse').change(update);
    $('#minHsvHue').change(update);
    $('#maxHsvHue').change(update);
    $('#minHsvSat').change(update);
    $('#maxHsvSat').change(update);
    $('#minHsvVal').change(update);
    $('#maxHsvVal').change(update);
    $('#swatchWidth').change(update);
    $('#swatchHeight').change(update);
    $('#swatchAlign').change(updateAlign);
    $('#swatchBorder').change(update);
    $('#outputFormat').change(update);
    $('#swatchDimensionsSeparator').click(function(){
        var temp = $('#swatchWidth').val();
        $('#swatchWidth').val($('#swatchHeight').val());
        $('#swatchHeight').val(temp);
        update();
    });
});

function updateAlign() {
    var t = $('#swatchWidth').val();
    $('#swatchWidth').val($('#swatchHeight').val());
    $('#swatchHeight').val(t);
    update();
}