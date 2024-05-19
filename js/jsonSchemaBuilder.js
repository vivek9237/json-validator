import { jsonrepair } from 'https://cdn.jsdelivr.net/npm/jsonrepair/+esm'

$(document).ready(function () {
	$('input#wordwrapCheckbox').change(
		function () {
			if ($(this).is(':checked')) {
				wrapJsons();
			} else {
				unwrapJsons();
			}
		}
	);
	$('input#minifyCheckbox').change(
		function () {
			if ($(this).is(':checked')) {
				beautifyJsons();
			} else {
				minifyJsons();
			}
		}
	);
	$('input#escapeJsonCheckbox').change(
		function () {
			if ($(this).is(':checked')) {
				escapeJsons();
			} else {
				unescapeJsons();
			}
		}
	);
	$('button#fixJsons').click(
		function () {
			fixJsons();
		}
	);
	$('button#clearJsons').click(
		function () {
			clearJsons();
		}
	);
	$('button#copyJSONSchema').click(
		function () {
			copyJSONSchema();
		}
	);
	$('button#shareJsons').click(
		function () {
			shareJsons();
		}
	);
});

var waiting;
var jsonSchemaEditor = CodeMirror.fromTextArea
	(document.getElementById('jsonSchemaArea'), {
		mode: "application/ld+json",
		theme: "dracula",
		lineNumbers: true,
		lineWrapping: true,
		scrollbarStyle: "simple",
		extraKeys: {
			"F11": function (cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function (cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		}
	});

jsonSchemaEditor.on('change', jsonSchemaEditor => {
	try {
		localStorage.setItem('vivek9237-json-validator', jsonSchemaEditor.getDoc().getValue());
		clearTimeout(waiting);
		waiting = setTimeout(updateHints, 500);
	} catch (err) {
		console.log("Invalid Json")
	}
});

setTimeout(updateHints, 100);

var widgets = [];

function updateHints() {
	if (!$('input#escapeJsonCheckbox').is(':checked')) {
		jsonSchemaEditor.operation(function () {
			for (var i = 0; i < widgets.length; ++i)
				jsonSchemaEditor.removeLineWidget(widgets[i]);
			widgets.length = 0;

			JSHINT(jsonSchemaEditor.getValue());
			for (var i = 0; i < JSHINT.errors.length; ++i) {
				var err = JSHINT.errors[i];
				if (!err) continue;
				var msg = document.createElement("div");
				var icon = msg.appendChild(document.createElement("span"));
				icon.innerHTML = "⛔";
				icon.className = "lint-error-icon";
				msg.appendChild(document.createTextNode(err.reason));//Show detailed error
				msg.className = "lint-error";
				widgets.push(jsonSchemaEditor.addLineWidget(err.line - 1, msg, { coverGutter: false, noHScroll: true }));
				break;// added by vivek | it will only show one error
			}
		});
		var info = jsonSchemaEditor.getScrollInfo();
		var after = jsonSchemaEditor.charCoords({ line: jsonSchemaEditor.getCursor().line + 1, ch: 0 }, "local").top;
		if (info.top + info.clientHeight < after)
			jsonSchemaEditor.scrollTo(null, after - info.clientHeight + 3);
	}
}


var where = 'bottom';
var numPanels = 0;

function makePanel(where, editorName) {
	var node = document.createElement("div");
	var id = ++numPanels;
	var label;
	node.id = "panel-" + id;
	node.className = "panel " + where;
	var buttonNode = document.createElement("button");
	buttonNode.className = "controls__button controls__button--minify";
	buttonNode.onclick = function () {
		copyJson(editorName);
	};
	label = node.appendChild(buttonNode);
	label.innerHTML = "Copy " + editorName;
	return node;
}

jsonSchemaEditor.setSize("100%", "100%");

function fixJsons() {
	var inputJsonValue = jsonSchemaEditor.getDoc().getValue();
	var correctedJSON = jsonrepair(inputJsonValue);
	jsonSchemaEditor.getDoc().setValue(correctedJSON);
	beautifyJsons();
}
function clearJsons() {
	jsonSchemaEditor.getDoc().setValue("");
}
function wrapJsons() {
	jsonSchemaEditor.setOption("lineWrapping", true);
}
function unwrapJsons() {
	jsonSchemaEditor.setOption("lineWrapping", false);
}
function minifyJsons() {
	try {

	} catch (err) {
		console.log("Unable to parse inputJSON Editor");
	} try {
		var temp2 = jsonSchemaEditor.getDoc().getValue();
		var minifiedTemp2 = JSON.stringify(JSON.parse(temp2));
		jsonSchemaEditor.getDoc().setValue(minifiedTemp2);
	} catch (err) {
		console.log("Unable to parse inputJSON Editor");
	}
}

function beautifyJsons() {
	try {
	} catch (err) {
		console.log("Unable to parse inputJSON Editor");
	}
	try {
		var temp2 = jsonSchemaEditor.getDoc().getValue();
		var minifiedTemp2 = JSON.stringify(JSON.parse(temp2), null, 2);
		jsonSchemaEditor.getDoc().setValue(minifiedTemp2);
	} catch (err) {
		console.log("Unable to parse jsonSchema Editor");
	}
}

function escapeJsons() {
	var escapedString = JSON.stringify(jsonSchemaEditor.getDoc().getValue());
	jsonSchemaEditor.getDoc().setValue(escapedString);
}

function unescapeJsons() {
	var unescapedString = JSON.parse(jsonSchemaEditor.getDoc().getValue());
	jsonSchemaEditor.getDoc().setValue(unescapedString);
}

function copyJSONSchema() {
	/* Get the text field */

	var copyText = jsonSchemaEditor.getDoc().getValue();
	navigator.clipboard.writeText(copyText);
}
function shareJsons() {
	var inputJsonText = jsonSchemaEditor.getDoc().getValue();
	navigator.clipboard.writeText("https://vivek9237.github.io/json-validator?data=" + urlEncode(encodeBase64(inputJsonText)));
}
function copyJson(editorName) {
	/* Get the text field */
	if (editorName == "JSON Schema") {
		var copyText = jsonSchemaEditor.getDoc().getValue();
		navigator.clipboard.writeText(copyText);
	} else if (editorName == "Input JSON") {
	}
}

function getQueryParam(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);

}

function decodeBase64(base64String) {
	return decodeURIComponent(atob(base64String).split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

function encodeBase64(input) {
	return btoa(input);
}

function urlEncode(input) {
	return encodeURIComponent(input);
}

const base64Data = getQueryParam('data');
if (base64Data) {
	const decodedData = decodeBase64(base64Data);
	jsonSchemaEditor.getDoc().setValue(decodedData);
	history.pushState(null, '', 'https://vivek9237.github.io/json-validator/');
} else {
	jsonSchemaEditor.getDoc().setValue(localStorage.getItem('vivek9237-json-validator'));
}
