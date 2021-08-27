const logo = document.querySelectorAll("#logo path");


for(let i = 0; i<logo.length; i++){
    console.log(`Letter ${i} is ${logo[i].getTotalLength()}`)
}

const logo2 = document.querySelectorAll("#logo2 path");
console.log(logo2);
var _root = getComputedStyle(document.documentElement);
var animValue = _root.getPropertyValue('--anim');

let animDelay = "0s";
let increment = 0;
for(let i=0;i<logo2.length;i++){
    
    let letterLength = logo2[i].getTotalLength();
    logo2[i].setAttribute("stroke-dasharray", letterLength);
    logo2[i].setAttribute("stroke-dashoffset", letterLength);
    
    logo2[i].style.animation = animValue;
    logo2[i].style.animationDelay = animDelay;
    increment += .15;
    animDelay = `${increment}S`;
}