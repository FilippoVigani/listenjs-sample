/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@filippovigani/listenjs/listen.js":
/*!********************************************************!*\
  !*** ./node_modules/@filippovigani/listenjs/listen.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Listener {\r\n    constructor(endpoint) {\r\n        this.socket = new WebSocket(endpoint);\r\n    }\r\n\r\n    set onupdate(callback){\r\n        this.socket.onmessage = function(event){\r\n            callback(event.data);\r\n        }\r\n    }\r\n\r\n    set onconnected(callback){\r\n        this.socket.onopen = function(event){\r\n            callback();\r\n        }\r\n    }\r\n\r\n    set onerror(callback){\r\n        this.socket.onerror = function(error){\r\n            callback(error);\r\n        }\r\n    }\r\n\r\n    set ondisconnected(callback){\r\n        this.socket.onclose = function(event){\r\n            callback();\r\n        }\r\n    }\r\n\r\n    dispose(){\r\n        this.socket.close();\r\n    }\r\n}\r\n\r\nconst listen = function (endpoint) {\r\n    if (typeof endpoint !== \"string\") throw new TypeError(\"Endpoint must be a string\");\r\n    return new Listener(endpoint);\r\n};\r\n\r\nmodule.exports.listen = listen\n\n//# sourceURL=webpack:///./node_modules/@filippovigani/listenjs/listen.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _filippovigani_listenjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @filippovigani/listenjs */ \"./node_modules/@filippovigani/listenjs/listen.js\");\n/* harmony import */ var _filippovigani_listenjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_filippovigani_listenjs__WEBPACK_IMPORTED_MODULE_0__);\n\r\n\r\nwindow.onload = function() {\r\n\r\n    // Get references to elements on the page.\r\n    const form = document.getElementById('message-form');\r\n    const messageField = document.getElementById('message');\r\n    const messagesList = document.getElementById('messages');\r\n    const socketStatus = document.getElementById('status');\r\n    const closeBtn = document.getElementById('close');\r\n\r\n\r\n    const listener = Object(_filippovigani_listenjs__WEBPACK_IMPORTED_MODULE_0__[\"listen\"])('wss://echo.websocket.org')\r\n\r\n    // Handle any errors that occur.\r\n    listener.onerror = function(error) {\r\n        console.log('WebSocket Error: ' + error);\r\n    };\r\n\r\n\r\n    // Show a connected message when the WebSocket is opened.\r\n    listener.onconnected = function() {\r\n        socketStatus.innerHTML = 'Connected!';\r\n        socketStatus.className = 'open';\r\n    };\r\n\r\n\r\n    // Handle messages sent by the server.\r\n    listener.onupdate = function(payload) {\r\n        messagesList.innerHTML += '<li class=\"received\"><span>Received:</span>' + payload + '</li>';\r\n    };\r\n\r\n    // Show a disconnected message when the WebSocket is closed.\r\n    listener.ondisconnected = function() {\r\n        socketStatus.innerHTML = 'Disconnected from WebSocket.';\r\n        socketStatus.className = 'closed';\r\n    };\r\n\r\n\r\n    // Send a message when the form is submitted.\r\n    form.onsubmit = function(e) {\r\n        e.preventDefault();\r\n\r\n        // Retrieve the message from the textarea.\r\n        const message = messageField.value;\r\n\r\n        // Send the message through the WebSocket.\r\n        listener.socket.send(message);\r\n\r\n        // Add the message to the messages list.\r\n        messagesList.innerHTML += '<li class=\"sent\"><span>Sent:</span>' + message + '</li>';\r\n\r\n        // Clear out the message field.\r\n        messageField.value = '';\r\n\r\n        return false;\r\n    };\r\n\r\n\r\n    // Close the WebSocket connection when the close button is clicked.\r\n    closeBtn.onclick = function(e) {\r\n        e.preventDefault();\r\n\r\n        // Close the WebSocket.\r\n        listener.dispose();\r\n\r\n        return false;\r\n    };\r\n\r\n};\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });