// Keep the DOM quiet between actual visual changes. Reading inline styles does
// not force layout; do not replace this with getComputedStyle in the frame loop.
export function styleValue(el,name,value){
 if(el.style.getPropertyValue(name)!==value)el.style.setProperty(name,value);
}
export function attributeValue(el,name,value){
 if(el.getAttribute(name)!==value)el.setAttribute(name,value);
}
export function textValue(el,value){value=String(value);if(el.textContent!==value)el.textContent=value;}
export function classValue(el,name,on){on=!!on;if(el.classList.contains(name)!==on)el.classList.toggle(name,on);}
export function propertyValue(el,name,value){if(el[name]!==value)el[name]=value;}
