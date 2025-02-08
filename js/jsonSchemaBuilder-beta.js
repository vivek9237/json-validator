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
	setTimeout(function () {
		$('button#beautify').click(
			function () {
				beautifyJsons();
			}
		);
		$('button#minify').click(
			function () {
				minifyJsons();
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
		$('button#downloadJSON').click(
			function () {
				downloadJSON();
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
	}, 10);
	// Event listener for Ctrl + S
	document.addEventListener('keydown', function (e) {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault(); // Prevent the default browser save action
			downloadJSON();
		}
	});

	var newDiv = $(
		`<div class="toolbar">
			<div class="left-buttons">
			<label class="">
				<button id="beautify" title="Beautify JSON" class="left-buttons controls__button controls__button--minify">
					<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="16" height="16" aria-label="" role="presentation" viewBox="0 0 512 512" style=""><path fill="currentColor" d="M 0,32 v 64 h 416 v -64 z M 160,160 v 64 h 352 v -64 z M 160,288 v 64 h 288 v -64 z M 0,416 v 64 h 320 v -64 z"></path></svg>
				</button>
			</label>
			<!-- NOT YET SUPPORTED
			<label class="">
				<button id="beautifyJSONCompact" title="test" class="left-buttons controls__button controls__button--minify">
					<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="16" height="16" aria-label="" role="presentation" viewBox="0 0 512 512" style=""><path fill="currentColor" d="m 448,512 -15,-49 -49,-15 49,-15 15,-49 15,49 49,15 -45,15 zM 335,512 294,376 156,335 292,294 333,156 374,292 512,333 376,374 Z M 0,32 V 96 H 512 V 32 Z M 0,288 v 64 h 128 v -64 Z M 0,160 v 64 h 256 v -64 Z "></path>  </svg>
				</button>
			</label>
			-->
			<label class="">
				<button id="minify" title="Minify JSON" class="left-buttons controls__button controls__button--minify">
					<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="16" height="16" aria-label="" role="presentation" viewBox="0 0 512 512" style=""><path fill="currentColor" d="M 0,32 v 64 h 512 v -64 z M 0,160 v 64 h 512 v -64 z M 0,288 v 64 h 352 v -64 z"></path>  </svg>
				</button>
			</label>
			<label class="">
				<button id="fixJsons" title="Fix Errors" class="left-buttons controls__button_beta controls__button--minify">
				<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="16" height="16" aria-label="" role="presentation" viewBox="0 0 512 512" style=""><path fill="currentColor" d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path></svg>
				</button>
			</label>
			</div>
			<div class="right-buttons">
			<label class="">
				<button id="clearJsons" title="Clear Editor" class="right-buttons controls__button controls__button--minify">
					<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="14" height="16" aria-label="" role="presentation" viewBox="0 0 448 512" style=""><path fill="currentColor" d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>  </svg>
				</button>
			</label>
			<label class="">
				<button id="downloadJSON" title="Download JSON" class="right-buttons controls__button controls__button--minify">
				<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="14" height="16" aria-label="" role="presentation" viewBox="0 0 448 512" style=""> <path fill="currentColor" d="M212.991,249.518c9.767,9.66,25.508,9.624,35.25-0.1l74.888-74.887c9.763-9.763,9.763-25.592,0-35.355 				c-9.762-9.763-25.591-9.763-35.355,0l-32.21,32.209V47.596c0-13.808-11.193-25-25-25s-25,11.192-25,25v123.79l-32.21-32.209 				c-9.764-9.764-25.593-9.764-35.355,0c-9.763,9.764-9.763,25.593,0,35.355C139.121,175.656,211.868,248.403,212.991,249.518z"/> 			<path fill="currentColor" d="M431.654,312.404H28.346C12.691,312.404,0,325.094,0,340.75v68.307c0,15.655,12.691,28.346,28.346,28.346h403.307 				c15.655,0,28.346-12.691,28.346-28.346V340.75C460,325.094,447.309,312.404,431.654,312.404z"/></svg>
				</button>
			</label>
			<label class="">
				<button id="shareJsons" title="Share JSON" class="right-buttons controls__button controls__button--minify">
					<svg version="1.1" class="fa-icon svelte-1mc5hvj" width="14" height="16" aria-label="" role="presentation" viewBox="0 0 448 512" style=""> <path fill="currentColor" d="M339.588,314.529c-14.215,0-27.456,4.133-38.621,11.239l-112.682-78.67c1.809-6.315,2.798-12.976,2.798-19.871 				c0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764,8.356,26.133,13.286,41.662,13.286c39.79,0,72.047-32.257,72.047-72.047 				C411.634,32.258,379.378,0,339.588,0c-39.79,0-72.047,32.257-72.047,72.047c0,5.255,0.578,10.373,1.646,15.308l-112.424,78.491 				c-10.974-6.759-23.892-10.666-37.727-10.666c-39.79,0-72.047,32.257-72.047,72.047s32.256,72.047,72.047,72.047 				c13.834,0,26.753-3.907,37.727-10.666l113.292,79.097c-1.629,6.017-2.514,12.34-2.514,18.872c0,39.79,32.257,72.047,72.047,72.047 				c39.79,0,72.047-32.257,72.047-72.047C411.635,346.787,379.378,314.529,339.588,314.529z"/></svg>
				</button>
			</label>
			</div>
		</div>`
	);
	var delayInMilliseconds = 1; //1 second
	setTimeout(function () {
		$("div.CodeMirror.cm-s-dracula.CodeMirror-wrap.CodeMirror-simplescroll").prepend(newDiv);
	}, delayInMilliseconds);
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
var where = 'bottom';
var numPanels = 0;
jsonSchemaEditor.setSize("100%", "100%");
const base64Data = getBase64Data();
if (base64Data) {
	const decodedData = decodeBase64(base64Data);
	jsonSchemaEditor.getDoc().setValue(decodedData);
	history.pushState(null, '', 'https://vivek9237.github.io/json-validator/beta.html');
} else {
	jsonSchemaEditor.getDoc().setValue(localStorage.getItem('vivek9237-json-validator'));
}




/**********************************Functions***************************************************/
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


function fixJsons() {
	var inputJsonValue = jsonSchemaEditor.getDoc().getValue();
	var correctedJSON = jsonrepair(inputJsonValue);
	jsonSchemaEditor.getDoc().setValue(correctedJSON);
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
	//navigator.clipboard.writeText("https://vivek9237.github.io/json-validator?data=" + urlEncode(encodeBase64(inputJsonText)));
	if (navigator.share) {
		try {
			/*
			navigator.share({
				title: 'JSON Validator and Formatter',
				text: 'Checkout this JSON Configuration',
				url: "https://vivek9237.github.io/json-validator/beta.html#data=" + urlEncode(encodeBase64(inputJsonText)),
			});
			*/
			const isIframe = window !== window.parent;
			
			if (!isIframe) {
				// Not inside an iframe: Call navigator.share directly
				if (navigator.share) {
					navigator.share({
						title: 'JSON Validator and Formatter',
							text: 'Checkout this JSON Configuration',
							url: "https://vivek9237.github.io/json-validator/beta.html#data=" + urlEncode(encodeBase64(inputJsonText)),
					}).catch(console.error);
				} else {
					alert("Sharing not supported.");
				}
			} else {
				// Inside an iframe: Send message to Chrome extension popup
				chrome.runtime.sendMessage({
					action: "share",
					title: 'JSON Validator and Formatter',
							text: 'Checkout this JSON Configuration',
							url: "https://vivek9237.github.io/json-validator/beta.html#data=" + urlEncode(encodeBase64(inputJsonText))
				});
			}
		} catch (error) {
			console.error('Error sharing', error);
		}
	} else {
		alert('Web Share API not supported in this browser.');
	}
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

function getBase64Data(){
	var urlarr = window.location.href.split('#data=');
	console.log(urlarr[0]);
	if(urlarr.length > 1 ){
		console.log(urlarr[1]);
		return urlarr[1];
	}
	return null;
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

function downloadJSON() {
	const content = jsonSchemaEditor.getDoc().getValue();
	//saveToFile('json-validator-code.json', content);
	saveToFile1(content);
}

// Function to save content as a file
function saveToFile(filename, content) {
	const blob = new Blob([content], { type: 'application/json' });
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
function saveToFile1(content) {
	const blob = new Blob([content], { type: 'application/json' });
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	// Prompt the user for a filename
	const filename = prompt('Enter the filename', 'jsonFileName');
	// If the user provides a filename, set the download attribute and click the link
	if (filename) {
		
		a.download = filename+'json';
		a.click();
		// Revoke the object URL to free up memory
		URL.revokeObjectURL(a.href);
	}
}
