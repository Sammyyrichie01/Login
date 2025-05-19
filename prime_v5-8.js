



Promise.prototype.func = function(call) {
  if (call) {
    return this.then(call);
  }
}


Element.prototype.contentEdit = function(callback) {
  this.setAttribute('contenteditable', 'true');
  callback(this.style);
  return this;
}


Element.prototype.setPlaceholder = function(options) {
  this.dataset.placeholder = options.text || '';
  const style = document.createElement('style');
  style.innerHTML = `
    [data-placeholder]:empty::before {
      content: attr(data-placeholder);
      ${Object.keys(options).reduce((styles, key) => {
        if (key !== 'text') {
          styles += `${key}: ${options[key]};`;
        }
        return styles;
      }, '')}
    }
  `;
  document.head.appendChild(style);
  return this;
}


let alertId = 0;

function ralert(text, btn1 = 'OK') {
return new Promise((resolve, reject) => {
  const currentId = alertId++;
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: ${999 - alertId + currentId}; display: flex; justify-content: center; align-items: center;" id="backdrop-${currentId}">
      <div id="ralert-${currentId}" style="padding: 30px; border-radius: 5px; background: #fff; border: 1px solid #ddd; width: 70%; max-width: 500px; z-index: ${1000 - alertId + currentId};">
        <p style="margin-top: -5px; margin-bottom: 50px; max-height: 350px; overflow-y: auto; background: white; color: black;" id="page-${currentId}">${text || ''}</p>
        <button id="btn1-${currentId}" style="float: right; margin-top: 15px; border: none; background: white; font-weight: bold; color: black;">${btn1}</button>
      </div>
    </div>
  `;
  document.body.append(div);
  document.getElementById(`btn1-${currentId}`).onclick = function () {
  resolve('true');
    div.remove();
  }
  document.addEventListener('click', (event) => {
    if(event.target.id === `backdrop-${currentId}`) {
      div.remove();
    }
  })
  })
}


let confirmId = 0;

function rconfirm(text, btn1 = 'CANCEL', btn2 = 'OK') {
  return new Promise((resolve, reject) => {
    const currentId = confirmId++;
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: ${999 - confirmId + currentId}; display: flex; justify-content: center; align-items: center;" id="backdrop-${currentId}">
        <div id="rconfirm-${currentId}" style="padding: 30px; border-radius: 5px; background: #fff; border: 1px solid #ddd; width: 70%; max-width: 500px; z-index: ${1000 - confirmId + currentId};">
          <p style="margin-top: -5px; margin-bottom: 50px; background: white; color: black;" id="page1-${currentId}">${text}</p>
          <div style="float: right; margin: 5px; background: white; color: black;">
            <button id="btn1-${currentId}" style="margin-top: 15px; border: none; background: white; font-weight: bold; color: black;">${btn1}</button>
            <button id="btn2-${currentId}" style="margin-top: 15px; border: none; background: white; font-weight: bold; color: black;">${btn2}</button>
          </div>
        </div>
      </div>
    `;
    document.body.append(div);
    document.getElementById(`btn1-${currentId}`).onclick = function () {
      resolve({ value: 'false', text: document.getElementById(`page1-${currentId}`).textContent });
      div.remove()
    }
    document.getElementById(`btn2-${currentId}`).onclick = function () {
      resolve({ value: 'true', text: document.getElementById(`page1-${currentId}`).textContent });
      div.remove()
    }
    document.addEventListener('click', (event) => {
      if(event.target.id === `backdrop-${currentId}`) {
        div.remove();
      }
    })
  })
}
 

let promptId = 0;

function rprompt(text, btn1 = 'CANCEL', btn2 = 'OK') {
  return new Promise((resolve, reject) => {
    const currentId = promptId++;
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: ${999 - promptId + currentId}; display: flex; justify-content: center; align-items: center;" id="backdrop-${currentId}">
        <div id="rprompt-${currentId}" style="padding: 30px; border-radius: 5px; background: #fff; border: 1px solid #ddd; width: 70%; max-width: 500px; z-index: ${1000 - promptId + currentId};">
          <p style="margin-top: -5px; margin-bottom: 50px; background: white; color: black;" id="pages-${currentId}">${text}</p>
          <input id="test-${currentId}" type="text" style="outline: none; border: none; border-bottom: 2px solid black; width: 100%; background: white; color: black;">
          <button id="btn1-${currentId}" style="float: left; margin-top: 15px; border: none; background: white; font-weight: bold; color: black;">${btn1}</button>
          <button id="btn2-${currentId}" style="float: right; margin-top: 15px; border: none; background: white; font-weight: bold; color: black;">${btn2}</button>
        </div>
      </div>
    `;
    document.body.append(div);
    document.getElementById(`btn1-${currentId}`).onclick = function () {
      resolve({ value: 'null', text: document.getElementById(`pages-${currentId}`).textContent });
      div.remove()
    }
    document.getElementById(`btn2-${currentId}`).onclick = function () {
      resolve({ value: document.getElementById(`test-${currentId}`).value, text: document.getElementById(`pages-${currentId}`).textContent });
      div.remove()
    }
    document.addEventListener('click', (event) => {
      if(event.target.id === `backdrop-${currentId}`) {
        div.remove();
      }
    })
    document.getElementById(`test-${currentId}`).focus();
  })
}


/* replace element not */
String.prototype.replaceExcept = function(charsToKeep, replacement, global) {
  let flag = '';
  if (global === true || global === 'g' || global === 'all') {
    flag = 'g';
  }
  const regex = new RegExp(`[^${charsToKeep}]`, flag);
  return this.replace(regex, replacement);
}


/* auto set html device width with user scalable */
const head = document.querySelector('head');

 const button = document.querySelectorAll('[true]');

if(head.getAttribute('user-scalable') === 'yes' || head.getAttribute('zoom') === 'yes') {
select('yes') 
} else {
 select('no')
}


/* process the html device width function */
function select(type) {
const create = document.createElement('meta');
create.setAttribute('name', 'viewport');
create.setAttribute('content', `width=device-width, initial-scale=1.0, user-scalable=${type}`);
head.append(create);     
return;
}
/* end of it */



/* limit character */
function limitChars(element, limit) {
if(!element) {
  throw new TypeError('limit() element is null!'); 
}

if(arguments.length === 2) {    
let property;
if(element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
   property = 'textContent';
} else {
    property = 'value';
}

  element.addEventListener('input', () => {
    const content = element[property];
    if (content.length > limit) {
      element[property] = content.slice(0, limit);
    }
  });
  } else {
      throw new RangeError('limit() require 2 argument!');
  }
}



/* focus() html input form */
Element.prototype.elementFocus = function() {
if(arguments.length === 0) {
 return this.focus();     
} else {
    throw new RangeError('inputFocus() does not require an argument!');
} 
}



/* count separators with split */
 function splitCount(string, separator) {
 if(arguments.length === 2) {
  return string.split(separator).length - 1;   
 } else if(arguments.length === 1) {
  return string.split('/').length - 1;   
 } else {
throw new RangeError(' countSeparators() require 1 or 2 argument!');   
 }      
}




// random array 
function randArr(elem) {
const free = Math.floor(Math.random() * elem.length);  
return elem[free];
}


/* change input type "password" to text or vice versa(password)  */
function inputType(element) {
if(arguments.length === 1) {    
   if(element.type == "password") {
   element.type = 'text';   
   } else {
   element.type = 'password';   
   }
   } else {
 throw new RangeError('inputType() require 1 argument!');     
   }
}


// css element.classList.add/remove/toggle
Element.prototype.addClass = function(style) {
if(arguments.length === 1) {
 return this.classList.add(style);   
} else {
throw new RangeError('addList() require 1 argument!');    
}   
}


Element.prototype.toggleClass = function(style) {
if(arguments.length === 1) {
   return this.classList.toggle(style);
   } else {
throw new RangeError('toggleList() require 1 argument!');    
}   
}


Element.prototype.removeClass = function(style) {
if(arguments.length === 1) {
   return this.classList.remove(style);
   } else {
throw new RangeError('removeList() require 1 argument!');    
}   
}
/* end of add/toggle/remove List */


/* Date.parse to minus two dates from themselves and get accurate */
function parseDate(first, second) {
 const date1 = Date.parse(first); 
 if(arguments.length === 1) {
return date1; 
 }
 if(arguments.length === 2) {
const date2 = Date.parse(second); 
return date1 > date2;
 }
 if(arguments.length === 0 || arguments.length > 2) {
throw new RangeError('parseDate() require 1 or 2 argument!');    
 }     
  }


function hash(url) {
if(arguments.length === 0) {
    return window.location.hash;
} else if(arguments.length === 1) {
if(window.location.hash === url) {
    return true; 
  } else {
      return false;
  }
} else {
    throw new RangeError('hash() require 0 or 1 argument!');
}
}



function port(url) {
if(arguments.length === 0) {
    return window.location.port;
} else if(arguments.length === 1) {
if(window.location.port === url) {
    return true; 
  } else {
      return false;
  }
} else {
    throw new RangeError('port() require 0 or 1 argument!');
}
}


function host(url) {
if(arguments.length === 0) {
    return window.location.hostname;
} else if(arguments.length === 1) {
if(window.location.hostname === url) {
    return true; 
  } else {
      return false;
  }
} else {
    throw new RangeError('host() require 0 or 1 argument!');
}
}


// get or verify url window.location.origin
function url(url) {
if(arguments.length === 0) {
    return window.location.origin;
} else if(arguments.length === 1) {
if(window.location.origin === url) {
    return true; 
  } else {
      return false;
  }
} else {
    throw new RangeError('url() require 0 or 1 argument!');
}
}



function path(url) {
if(arguments.length === 0) {
    return window.location.pathname;
} else if(arguments.length === 1) {
if(window.location.pathname === url) {
    return true; 
  } else {
      return false;
  }
} else {
    throw new RangeError('path() require 0 or 1 argument!');
}
}


function href(url) {
  if(arguments.length === 0) {
    return window.location.href;
} else if(arguments.length === 1) {
if(window.location.href === url) {
    return true; 
  } else {
      return false;
  }
} else {
    throw new RangeError('href() require 0 or 1 argument!');
}
}


Element.prototype.padding = function(operation) {
return this.style.padding = operation;  
}


/* show or hide html element and more*/
Element.prototype.display = function(operation) {
   if(operation == 0 || operation == false || operation === 'hide') {
this.style.display = 'none';      
   } else if(operation == 1 || operation == true || operation === 'show') {
this.style.display = 'block';      
   } else {
this.style.display = 'block';           
   }
   
   if(arguments.length > 1) {
 throw new RangeError('display() require 0 or 1 argument!');      
   }
}  


/* set html color */
Element.prototype.color = function(operation) {
if(arguments.length === 1) { 
return this.style.color = operation;  
} else if(arguments.length === 0) {
return this.style.color;
} else {
throw new RangeError('color() require 0 or 1 argument!');    
}   
}


/* set html background color*/
Element.prototype.bg = function(operation) {
if(arguments.length === 1) {
return this.style.backgroundColor = operation;  
} else if(arguments.length === 0) {
return this.style.backgroundColor;
} else {
throw new RangeError('bg() require 0 or 1 argument!');    
}   
}


/* set html width element */
Element.prototype.width = function(operation) {
if(arguments.length === 1) {
return this.style.width = operation;  
} else if(arguments.length === 0) {
return this.style.width;
} else {
throw new RangeError('width() require 0 or 1 argument!');    
}   
}


Element.prototype.height = function(operation) {
if(arguments.length === 1) {
return this.style.height = operation;  
} else if(arguments.length === 0) {
return this.style.height;
} else {
throw new RangeError('height() require 0 or 1 argument!');    
}   
}



// checking null value
function isnull(element) {
  if(element === null) {
  return true;    
  } else {
      return false;
 }
 }
 
 // checking undefined value
 function isundefined(element) {
   if(typeof element === 'undefined') {
   return true;   
   } else {
       return false;
   }
 }
 
// validating email
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


// checking string value 
function isstring(element) {
   if(element && typeof element === 'string') {
  return true;    
   } else {
       return false;
   }
}


// checking typeof number 
function isnumber(element) {
   if(element && typeof element === 'number') {
   return true;   
   } else {
       return false;
   }
}


// checking object value
function isobject(element) {
    if(element && typeof element === 'object') {
  return true;     
    } else {
        return false;
    }
}


// checking function value 
function isfunc(element) {
  if(element && typeof element === 'function') {
  return true;   
  } else {
      return false;
  }
}


// checking array value
function isarray(element) {
 if(element && Array.isArray(element)) {
   return true;
 } else {
     return false;
 }
}


// strict check for 1 value 
function type(value, types = null) {
if(arguments.length === 1) {
  if(typeof value === 'object') {
  return Array.isArray(value) ? 'array' : typeof value;
} else {
    return typeof value;
}
} else if (arguments.length === 2) {
    return Array.isArray(value) && types === 'array' ? true : typeof value === types && !Array.isArray(value);
  } else {
    throw new RangeError(`Unexpected argument length. Expecting 1 or 2, receive '${arguments.length}'`);
  }
 }


// checking if a number is int
function isInt(num = 1.0) {
if(!isNaN(num)) {
  return num % 1 === 0;  
}  
}


// checking if a number is float
function isFloat(num) {
if(arguments.length === 0 || arguments.length > 1) {
    throw new RangeError(`Unexpected isFloat() argument length. Expected 1, received '${arguments.length}'`)
} else if(!isNaN(num)) {
return num % 1 !== 0;     
} else {
 throw new TypeError(`isFloat() argument must be a number, received '${num}'`);   
}
}


// execute html code direct outerHTML 
 function parseHtml(element) {

  const parser = new DOMParser();
const doc = parser.parseFromString(element, 'text/html');
const elements = doc.body.firstChild;

return (
    elements.textContent || elements.innerHTML || elements.value
    );
  }


// toFixed function 
function fixed(number, length = 0) {
const stringToFloat = parseFloat(number);

 if(arguments.length === 0) {
 throw new Error('fixed() function required an argument');    
 } else if(isNaN(number) || isNaN(length)) {
   throw new Error(`fixed() argument must not include alphabet '${number} ${length}'`);
 } else if(arguments.length === 1) { 
return stringToFloat.toFixed(2);    
} else if(arguments.length === 2) {
   return parseFloat(number).toFixed(length)      
} else {
    throw new Error(`Unexpected fixed() argument length expecting 1 or 2 but received '${arguments.length}'`);
}
 
 }
    

// JSON.stringify function 
function json(element) {
if(arguments.length === 1) {
    return JSON.stringify(element);
    } else {
 throw new Error('Unexpected argument length');        
    }
}


// JSON.parse function 
function parse(element) {
if(arguments.length === 1) {
 return JSON.parse(element);   
} else {
 throw new Error('Unexpected argument length');     
}
  
}


// random number function 
function random(...args) {
  if(args.length === 1) {
return Math.floor(Math.random() * args[0]);    
  } else if(args.length === 2) {
return Math.floor(Math.random() * (args[1] - args[0] + 1)) + args[0];      
  } else {
   throw new Error('Unexpected argument length');   
  }
}


// HTML selector function 
function $(element, all = null) {
 if(all) {
 return document.querySelectorAll(element); 
 } else {
 const select = document.getElementById(element) || document.querySelector(element);
return select;
}
 }


// previousElementSibling function 
Element.prototype.prev = function() {
return this.previousElementSibling;
 }


// nextElementSibling function 
Element.prototype.next = function() {
return this.nextElementSibling;    
}


 // DOM children function 
Element.prototype.child = function(index = 0) {
return this.children[index]; 
}
 
 
 
Element.prototype.start = function() {
  return this.firstElementChild;
}

 
Element.prototype.end = function() {
  return this.lastElementChild;
}


Element.prototype.afterParent = function(element) {
  return this.append(element);
}


Element.prototype.beforeParent = function(element) {
  return this.prepend(element);
}


Element.prototype.pop = function() {
  return this.remove();
} 


/* set attribute for html element */
Element.prototype.attr = function(...args) {
if(args.length === 0) {
  throw new Error('attr() Required at least 1 argument');
} else if(args.length === 1) {
 return this.getAttribute(args[0])   
 } else if(args.length === 2) {
 if(args[0] === 'remove') {
  return this.removeAttribute(args[1]);
 } else {
return this.setAttribute(args[0], args[1]);  
}      
 } else {
     throw new Error('Unexpected attr() argument length');
     return;
 }
}


/* remove attribute from html attribute */
Element.prototype.removeAttr = function(...args) {
    if(args.length === 1) {
   return this.removeAttribute(args[0]);  
    } else {
   throw new Error('Unexpected argument length');     
    }
}


/* set placeholder in html */
Element.prototype.ph = function(element) {
    return this.placeholder = element;
}


/* get html input value */
Element.prototype.val = function(element) {
 if(element || element === '') {
 return this.value = element;   
 } else {
return this.value;       
 }
}


/* get html div,span and more innerHTML */
Element.prototype.html = function(element) {
 if(element || element === '') {
return this.innerHTML = element;        
 } else {
  return this.innerHTML;     
 } 
}


/* get html value textContent */
Element.prototype.text = function(element) {
 if(element || element === '') {
return this.textContent = element;        
 } else {
  return this.textContent;      
 }
}


/* create element for html */
function create(element) {
return document.createElement(element); 
}


/* set html style css */
Element.prototype.css = function(...args) {
if(args.length === 2) {
return this.style[args[0]] = args[1];    
} else {
    return this.style[args[0]];
} 

if(args.length === 0 || args.length > 2) {
  throw new Error('Unexpected css() argument length');
  return;
}
}


/* hide html element */
Element.prototype.hide = function() {
 return this.style.display = 'none'; 
}


/* show html element */
Element.prototype.show = function() {
 return this.style.display = 'block'; 
}


/* fade out html element based on delay */
Element.prototype.fadeOut = function(delay = 0) {
  this.style.display = 'block';
  this.style.opacity = 1;
  this.style.transition = `all ${delay / 1000}s`;
  setTimeout(() => {
    this.style.opacity = 0;
  }, 0); 
  setTimeout(() => {
    this.style.display = 'none';
  }, delay); 
  return this;
}




/* fade in html element based on delay */
Element.prototype.fadeIn = function(delay = 0) {
  const fit = delay / 1000;
  this.style.transition = `all ${fit}s`;
  this.style.display = 'block';
  this.style.opacity = 0;
  this.offsetHeight; // Trigger a reflow
  this.style.opacity = 1;
  return this;
}

/* delay element */
Element.prototype.delay = function(delay = 0) {
  const self = this;
  return {
    func: (callback) => {
      setTimeout(() => {
        callback(self);
      }, delay);
      return this.delay(0);
    },
    delay: (newDelay) => {
      return self.delay(newDelay);
    }
  }
}



// sliding down element based on duration 
Element.prototype.slideDown = function(delay) {
  const fit = delay / 1000;
  this.style.transition = `max-height ${fit}s ease-in-out`;
  this.style.overflow = 'hidden';
  this.style.maxHeight = '0px';
  const scrollHeight = this.scrollHeight;
  setTimeout(() => {
    this.style.maxHeight = `${scrollHeight}px`;
  }, 0); // Start the animation immediately
}



// sliding element from left and stop
Element.prototype.slideLeft = function(delay = 100) {
if(isNaN(delay)) {
   throw new Error('slideLeft() argument must not include "alphabet"'); 
} else {
const timer = delay / 1000;
const timing = timer / 3;
this.style.transform = 'translateX(-100%)';
this.style.transition = `transform ${timing}s ease-out`;
setTimeout(() => {
this.style.transform = 'translateX(0)';
}, timer);

return this;
}
}


// sliding element from right then stop
Element.prototype.slideRight = function(delay = 100) {
if(isNaN(delay)) {
   throw new Error('slideRight() argument must not include "alphabet"'); 
} else {
const timer = delay / 1000;
const timing = timer / 3;
this.style.transform = 'translateX(100%)';
this.style.transition = `transform ${timing}s ease-out`;
setTimeout(() => {
this.style.transform = 'translateX(0)';
}, timer);

return this;
}
}


// it work as scrolling from right to left continuously 
Element.prototype.tickerRight = function(delay = 10, duration = 5000) {
  const originalHtml = this.innerHTML;
  const timer = delay / 1000;
  const text = this.textContent;
  const width = this.offsetWidth;
  this.style.overflow = 'hidden';
  this.innerHTML = `${text}`;
  let x = width;
  const intervalId = setInterval(() => {
    x -= 1;
    this.style.transform = `translateX(${x}px)`;
    if (x <= -width) {
      x = width;
    }
  }, timer);
  setTimeout(() => {
    clearInterval(intervalId);
    this.style.transform = '';
    this.style.overflow = '';
    this.innerHTML = originalHtml; // Restore original HTML content
  }, duration);
  return this;
}



// it work as scrolling from left to right continuously 
Element.prototype.tickerLeft = function(delay = 10, duration = 5000) {
  const originalHtml = this.innerHTML;
  const timer = delay / 1000;
  const text = this.textContent;
  const width = this.offsetWidth;
  this.style.overflow = 'hidden';
  this.innerHTML = `${text}`;
  let x = -width;
  const intervalId = setInterval(() => {
    x += 1;
    this.style.transform = `translateX(${x}px)`;
    if (x >= width) {
      x = -width;
    }
  }, timer);
  setTimeout(() => {
    clearInterval(intervalId);
    this.style.transform = '';
    this.style.overflow = '';
    this.innerHTML = originalHtml; // Restore original HTML content
  }, duration);
  return this;
}



// it work as sliding element up on duration 
Element.prototype.slideUp = function(delay) {
  const scrollHeight = this.scrollHeight;
  const fit = delay / 1000; // Calculate the transition time in seconds
  this.style.transition = `max-height ${fit}s ease-in-out`;
  this.style.overflow = 'hidden';
  this.style.maxHeight = `${scrollHeight}px`;
  
  // Trigger the animation
  requestAnimationFrame(() => {
    this.style.maxHeight = '0px';
  });
}



// all event listener 
Element.prototype.onEvent = function(...args) {
    if(args.length === 1) {
 this.addEventListener('click', args[0])      
    } else {
  if(args.length === 2) {
 this.addEventListener(args[0], args[1])       
  } else {
   throw new Error('Unexpected onEvent() argument length')   
  }    
    }
}


/* event click */
Element.prototype.onClick = function(callback) {
    this.addEventListener('click', callback);
    return callback;
}


/* event submit */
Element.prototype.onSubmit = function(callback) {
    this.addEventListener('submit', callback);
   return callback; 
}


/* event load */
 function onLoad(callback) {
    window.addEventListener('load', callback);
   return callback; 
}


/* event focus */
Element.prototype.onFocus = function(callback) {
    this.addEventListener('focus', callback);
  return callback;  
}


/* event DOMContentLoaded */
function onDom(callback) {
    document.addEventListener('DOMContentLoaded', callback);
  return callback;  
}

Element.prototype.onInput = function(callback) {
    this.addEventListener('input', callback);
  return callback;  
}


Element.prototype.onChange = function(callback) {
    this.addEventListener('change', callback);
  return callback;  
}

Element.prototype.onKeyPress = function(callback) {
    this.addEventListener('keypress', callback);
  return callback;  
}

Element.prototype.onKeyDown = function(callback) {
    this.addEventListener('keydown', callback);
 return callback;   
}

Element.prototype.onDbl = function(callback) {
    this.addEventListener('dblclick', callback);
    return callback;
}

Element.prototype.OnMouseDown = function(callback) {
    this.addEventListener('mousedown', callback);
    return callback;
}

Element.prototype.onMouseOver = function(callback) {
    this.addEventListener('mouseover', callback);
    return callback;
}

Element.prototype.onMouseUp = function(callback) {
    this.addEventListener('mouseup', callback);
  return callback;  
}


/* remove event from assign element */
Element.prototype.offEvent = function(...args) {
if(args.length === 2) {
  this.removeEventListener(args[0], args[1]);     
} else {
    throw new Error('Unexpected $off() argument length')
}
    
}

/* blur event */
Element.prototype.onBlur = function(callback) {
    this.addEventListener('blur', callback);
    return callback;
}


/* apply blur to element */
Element.prototype.blurEffect = function(fit) {

if(fit.toString().includes('px')) {
    return this.style.filter = `blur(${fit})`;
} else if(!fit.toString().includes('px')) {
  return this.style.filter = `blur(${fit}px)`;    
} 
}



/* parseInt element */
function int(...args) {
   if(args.length === 1) {
return parseInt(args[0]);                   
   } else {
 throw new Error('Unexpected int() argument length');    
   }}


/* parseFloat element */    
function float(...args) {
   if(args.length === 1) {
return parseFloat(args[0]);                   
   } else {
 throw new Error('Unexpected float() argument length');    
   }}
        

/* setInterval */
function interval(...args) {
if(args.length === 1) {
return clearInterval(args[0]); 
} else if(args.length === 2) {
const interval = setInterval(() => {
    args[1](this);
}, args[0])
return interval;
} else {
    throw new Error('Unexpected interval() error occur');
}
}


/* setTimeout */
function timeout(...args) {
  if(args.length === 1) {
return clearTimeout(args[0])     
  }else if(args.length === 2){
const timeout = setTimeout(() => {
 args[1](this);   
}, args[0]) 
return timeout;   
  }  
}


/* to Uppercase */
String.prototype.upper = function() {
return this.toUpperCase(); 

}


/* to Lowercase */
String.prototype.lower = function() {
return this.toLowerCase(); 
}


/* localStorage set,get,remove and more */
function storage(...args) {
   if(args.length === 2) {
    if(args[1] === 'remove') {
return localStorage.removeItem(args[0])  
} else {
    return localStorage.setItem(args[0], args[1]); 
}
}

   if(args.length === 1){

if(args[0] === 'clear') {
localStorage.clear();  
} else {
    return localStorage.getItem(args[0]);   
}  
} 


     if(args.length !== 1 || args.length > 2) {
throw new Error('Unexpected storage() argument length');   
}   
}



// toLocaleString function 
function dateLocale(option) {
    const from = new Date();
        
    if(option.location !== 'def' && option.number === true) {
    const saws = from.toLocaleString(option.location, { weekday: option.week, month: option.month, day: 'numeric', hour: 'numeric', second: 'numeric', minute: 'numeric'}); 
  return saws;    
    } else if(option.location === 'def' && option.number === true) {
  const saw = from.toLocaleString('default', { weekday: option.week, month: option.month, day: 'numeric', hour: 'numeric', second: 'numeric', minute: 'numeric'}); 
  return saw;
    } else if(option.location === 'def') {
 const see = from.toLocaleString('default', { weekday: option.week, month: option.month, day: option.day, hour: option.hour, second: option.second, minute: option.minute}); 
  return see;       
    } else if(option.location !== 'def') {
  const sees = from.toLocaleString(option.location, { weekday: option.week, month: option.month, day: option.day, hour: option.hour, second: option.second, minute: option.minute}); 
  return sees;             
    } else {
throw new Error('Invalid argument name');         
    }
 }
 
 

// get date function 
function date(type) {
   const data = new Date();
      
   if(arguments.length === 0) {
   return data;      
   } else if(arguments.length === 1) {   
   if(type && type.toString().toUpperCase().trim() === 'Y') {
   return data.getFullYear(); 
   } else if(type && type.toString().toUpperCase().trim() === 'M') {
   return data.getMonth(); 
   } else if(type && type.toString().toUpperCase().trim() === 'D') {
   return data.getDay(); 
   } else if(type && type.toString().toUpperCase().trim() === 'DD') {
   return data.getDate(); 
   } else if(type && type.toString().toUpperCase().trim() === 'MM') {
   return data.getMinutes(); 
   } else if(type && type.toString().toUpperCase().trim() === 'H') {
   return data.getHours(); 
   } else if(type && type.toString().toUpperCase().trim() === 'S') {
   return data.getSeconds(); 
   } else if(type && type.toString().toUpperCase().trim() === 'DEF') {
   return data.toLocaleString(); 
   } else if(type && type.toString().toUpperCase().trim() === true) {
   return data;
   } else {
   return new Date(type);
   }                            
   }        
 } 
   

Date.prototype.locale = function() {
  return this.toLocaleString();
}



// js math operation 
function math(operation, ...args) {  
if(!operation && args.length === 0) {
  throw new Error('math() function require a argument');  
} else if(operation.toUpperCase() === 'SQRT') {
 const tried = Math.sqrt(...args);
 return tried;
 } else if(operation.toUpperCase() === 'MIN') {
const tries = Math.min(...args);
return tries;   
 } else if(operation.toUpperCase() === 'MAX') {
const tries1 = Math.max(...args);
return tries1;      
 } else if(operation.toUpperCase() === 'CEIL') {
const tries2 = Math.ceil(...args);
return tries2;      
 } else if(operation.toUpperCase() === 'FLOOR') {
 const tries3 = Math.floor(...args);
return tries3;     
 } else if(operation.toUpperCase() === 'POW') {
  const tries4 = Math.pow(...args);
return tries4;    
 } else if(operation.toUpperCase() === 'LOG') {
 const tries5 = Math.log(...args);
return tries5;     
 } else if(operation.toUpperCase() === 'COS') {
 const tries6 = Math.cos(...args);
return tries6;     
 } else if(operation.toUpperCase() === 'TAN') {
 const tries7 = Math.tan(...args);
return tries7;     
 } else if(operation.toUpperCase() === 'SIN') {
 const tries8 = Math.sin(...args);
return tries8;     
 } else if(operation.toUpperCase() === 'ROUND') {
 const tries9 = Math.round(...args);
return tries9;     
 } else if(operation.toUpperCase() === 'ABS') {
 const tries10 = Math.abs(...args);
return tries10;     
 } else if(operation.toUpperCase() === 'EXP') {
 const tries11 = Math.exp(...args);
return tries11;     
 } else if(operation.toUpperCase() === 'CBRT') {
 const tries11 = Math.cbrt(...args);
return tries11;     
 } else {
  throw new Error('Invalid argument name');   
 } 
 }
  

/* append code to document*/ 
 function docAppend(element) {
return document.body.append(element); 
 }


/* prepend code to document */ 
 function docPrepend(element) {
  return document.body.prepend(element); 
 }


/* navigator.onLine is online,offline */
function isOnline(override) {
   if(arguments.length > 1) {
  throw new Error('isOnline() required only 1 argument')     
   } else if(override === true) {
 return navigator.onLine ? 'ONLINE' : 'OFFLINE';
} else {
    return navigator.onLine;
}
     }
     
     function isOffline(override) {
   if(arguments.length > 1) {
  throw new Error('isOffline() required only 1 argument')     
   } else if(override === true) {
 return navigator.onLine ? 'ONLINE' : 'OFFLINE';
} else {
    return !navigator.onLine;
}
     }


/* prevent form from default submit behavior*/
function pForm(test) {
    test.preventDefault();
 }  
 
 
/* submit form that was prevent */ 
 Element.prototype.sForm = function() { 
   return this.submit();  
 }



 // join array Concat()
 function joinArray(element, ...args) {
return element.concat(...args); 
 }



// detect browser online
 function eventOnline(callback) {
   if(arguments.length === 1) {
   window.addEventListener('online', callback);
  return callback;      
   } else {
 throw new Error('Unexpected detectOffline() argument length');
   }  
    }  


/* browser online, offline event */    
   function eventOffline(callback) {
   if(arguments.length === 1) {
   window.addEventListener('offline', callback);
  return callback;      
   } else {
 throw new Error('Unexpected detectOffline() argument length');
   }  
    }  


/* reload page location.reload  */
function reload(timer) {
   if(arguments.length === 0) {
    location.reload();   
   } else if(arguments.length === 1) {
  setTimeout(() => {
   location.reload();    
  }, timer)    
   } else {
  throw new RangeError('reload() does not require argument');
   }
}


/* redirect url */
function redirect(url, timer) {
   if(arguments.length === 1) {   
   window.location.href = url;           
   } else if(arguments.length === 2) {
  setTimeout(() => {
   window.location.href = url;       
  }, timer)    
   } else {
  throw new RangeError('Unexpected redirect() argument length');    
   }
}


/* set document title */
function docTitle(name) {
    if(arguments.length === 1) {
  return document.title = name;    
    } else {
  throw new Error('Unexpected docTitle() argument length');      
    }
}


/* Element to string */
function string(element) {  
  if(arguments.length === 1) {
return String(element);
} else {
   throw new Error('Unexpected toString() argument length');
   }   
}


/* convert string to array */
function stringToArr(element, separator) {
if(arguments.length === 1) {
return String(element).split("");    
} else if(arguments.length === 2) {
return String(element).split(separator);    
} else {
   throw new Error('stringToArr() require 1 or 2 argument!');
   }   
}


/* progress bar */
Element.prototype.progressBar = function(options) {
  const defaults = {
    width: 100,
    height: 10,
    background: 'yellow',
    foreground: 'green',
    duration: 10, // seconds
    borderRadius: '10px'
  };

  const settings = Object.assign(defaults, options);

  this.style.width = `${settings.width}%`;
  this.style.height = `${settings.height}px`;
  this.style.backgroundColor = settings.background;
  this.style.borderRadius = settings.borderRadius;
  this.style.overflow = 'hidden';

  const progressBar = document.createElement('div');
  progressBar.style.width = '0%';
  progressBar.style.height = '100%';
  progressBar.style.backgroundColor = settings.foreground;
  progressBar.style.transition = `width ${settings.duration}s`;

  this.appendChild(progressBar);

  setTimeout(() => {
    progressBar.style.width = '100%';
  }, 1);
};

// checking if a value is set
function isset(element) {
  if(element !== null && typeof element !== 'undefined') {
   return true;  
  } else {
      return false;
  }
  }    


// checking if a value is empty 
function isempty(value) {
if(arguments.length === 0 || arguments.length > 1) {
 throw new RangeError('isempty() require 1 argument!');  
}

  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim() === '') ||
    (typeof value === 'number' && isNaN(value)) ||
    (typeof value === 'boolean' && !value)
  );  
}



/* loading icon based on duration */
Element.prototype.loader = function(options) {
  const defaults = {
    width: 40,
    height: 40,
    background: '#f3f3f3',
    foreground: '#3498db',
    radius: '70',
    duration: 2, // seconds
    
  };

  const settings = Object.assign(defaults, options);

  this.style.width = `${settings.width}px`;
  this.style.height = `${settings.height}px`;
  this.style.border = `${settings.bgShow || 5}px solid ${settings.background}`;
  this.style.borderTop = `${settings.foreWeight || 5}px solid ${settings.foreground}`;
  this.style.borderRadius = `${settings.radius}%`;
  this.style.animation = `spin ${settings.duration}s linear infinite`;

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
};
    


/* fetch api data auto XML */    
  function getData(...args) {
    if (args.length % 2 !== 0) {
        throw new Error('Number of arguments must be even');
    }

    if (args.length > 100) {
        throw new Error('Number of arguments exceeds 100');
    }

    const pairs = [];

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        pairs.push(`${key}=${value}`);
    }

    return pairs.join('&');
}
    
function length(element) {
     return element.toString().length;     
        }

String.prototype.index = function(element) {
     return this.indexOf(element);
   }
   
 Array.prototype.lastIndex = function(element) {
     return this.lastIndexOf(element);
   }
 
 function lastIndex(element, value) {
   return element.lastIndexOf(value);  
 }
 
 function Index(element, value) {
   return element.indexOf(value);  
 }
        


Array.prototype.sliceArray = function(start, end) {
 return this.slice(start, end)   
 }  



/* fetch api custom */
function ajax(option) {  
 // Check for undefined then throw error  
  if(!option.url || option.url.trim() === "") {
throw new Error("Url is required");     
   }
   
// Validate URL
const tests = /^(?:https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}(:[0-9]+)?(\/.*)?$/;   
     
  if(!tests.test(option.url)) {
  throw new Error("Invalid Url");
}

// Variable 
   let methods = option.type || 'GET';
   let myUrl;
   let myData;
   let header;
   let content;
   

// Set myUrl depending on outcome  
   if(option.url && methods === option.type && methods !== 'GET') {
      myUrl = option.url 
   } else if(typeof option.data === 'object'){
   const param = new URLSearchParams(option.data).toString();
   
       myUrl = `${option.url}?${param}`;
   } else if(typeof option.data === 'string') {
      myUrl = option.url + '?' + option.data.replace(/ /g, '=').replace(/,/g, '&').replace(/\+/g, '&').replace(/-/g, '=');
   }
 
 
/* if option.data is undefined receive data instead of send */ 
if(!option.data) {
    myUrl = option.url;    
}  
   
 
   
   
   
   
/* Set data,header,content depending on outcome */ 
   
   if(option.data && methods === option.type) {
  if(typeof option.data === 'object') {
    myData = JSON.stringify(option.data);  
    header =  'application/json';
    content = 'Content-Type';
  } else if(typeof option.data === 'string') {
   myData = option.data;     
   header =  'text/plain';
    content = 'Content-Type';
  } else {
  myData = option.data;    
      header =  'application/octet-stream';
    content = 'Content-Type';    
  }   
       
   } else {
    myData = null;   
     header =  'application/octet-stream';
    content = 'Content-Type';
   }
   
      
/* Create the XMLHttpRequest() object */        
  var xhr = new XMLHttpRequest();
  xhr.open(methods, myUrl, true);
  xhr.setRequestHeader(content, header)
  xhr.send(myData);
  // Handle success 
  xhr.onload = function () {
  if(xhr.status >= 200 && xhr.status < 300) {
  if(option.parse) {
  return option.success(JSON.parse(xhr.responseText));  
  } else {
    return option.success(xhr.responseText);    
  }  
      
  } else {
  if(typeof option.status === 'function') {
 return option.status('NOT OK ' + xhr.statusText);        
  }
      
  }
  };
  
// Handle error if failed success 
  xhr.onerror = function () {
  if(typeof option.error !== 'function') {
    
  } else {
    return option.error('Error: ' + xhr.statusText); 
  }      
  }         
        }


/* line break html,css */
function br(type) {    
  if(arguments.length > 1) {
throw new Error('br() function require 1 or no argument');    
  } else {
  if(type && type.toUpperCase() === 'HTML') {
 return  '<br>';     
  } else {
      return '\n';
  } 
  }
  }  
    

/* fetch API post data XML custom */
function postData(...args) {
  if (args.length % 2 !== 0) {
    throw new Error('Number of arguments must be even');
  }

  if (args.length > 100) {
    throw new Error('Number of arguments exceeds 100');
  }

  const json = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    json[key] = value;
  }

  return json;
}
