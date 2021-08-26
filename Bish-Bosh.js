let boxAmount = document.getElementById("boxRange");
let bishRange = document.getElementById("bish");
let boshRange = document.getElementById("bosh");
boxAmount.nextElementSibling.value = boxAmount.value;
bishRange.nextElementSibling.value = bishRange.value;
boshRange.nextElementSibling.value = boshRange.value;

let grid =document.createElement("div");
grid.className="grid";
document.body.appendChild(grid);

// Skapar lådor 
function createBox(id){
    let boxContainer = document.createElement("div");
    boxContainer.className="box";
    boxContainer.id = id;
    bishboshText(id, boxContainer);
    return boxContainer;
}

// Räknar ut Bish-Bosh och sätter text i elementet
function bishboshText(id, el){
    let bish = bishRange.value;
    let bosh = boshRange.value;
    if(id%bish==0 && id%bosh==0)
     el.innerHTML ="<font color='white'> Bish-Bosh</font>";
     else if(id%bish == 0)
     el.innerHTML = "<font color='lightblue'>Bish</font>"
     else if(id% bosh==0)
     el.innerHTML = "<font color='pink'>Bosh</font>"
     else
     el.innerHTML = id;
 }

 // skapar lådor vid start (om boxAmount-rangen har ett value)
for(let i = 0; i<boxAmount.value;i++){
    grid.appendChild(createBox(grid.childElementCount));
}
// skapar och tar bort lådor med boxAmount-rangen
boxAmount.oninput=()=>{
    boxAmount.nextElementSibling.value = boxAmount.value;
    for(let i = 0; i<boxAmount.max;i++){
    if(grid.childElementCount < boxAmount.value || grid.childElementCount == null)
        grid.appendChild(createBox(grid.childElementCount));
    
    if(grid.childElementCount > boxAmount.value)
        grid.removeChild(grid.lastChild);

    }
}

// Väljer bosh-nummer och sätter texten i runtime
boshRange.oninput=()=>{
    boshRange.nextElementSibling.value = boshRange.value;
    for(let i=0;grid.childElementCount;i++){
        if(document.getElementById(i) !== null){
        let text = document.getElementById(i);
        bishboshText(i, text);
        }
        else
            return;
    }
}

// Väljer bish-nummer och sätter texten i runtime
bishRange.oninput=()=>{
    bishRange.nextElementSibling.value = bishRange.value;
    for(let i=0;grid.childElementCount;i++){
        if(document.getElementById(i) !== null){
        let text = document.getElementById(i);
        bishboshText(i, text);
        }
        else
            return;
    }
}