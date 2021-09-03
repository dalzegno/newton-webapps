/* 
 -----Cors-anywhere server------
https://cors-anywhere.herokuapp.com/corsdemo

--------- Platsuppslag
705b323a639c43e8b11a4b3268f02f80

https://api.sl.se/api2/typeahead.<FORMAT>?key=<DIN NYCKEL>&searchstring=<SÖKORD>&stationsonly=<ENDAST STATIONER>&maxresults=<MAX ANTAL SVAR>

 
 ---------SL-Realtidsinformation 4

6bbc7dca9df1475e936001327f82bbe9


 https://api.sl.se/api2/realtimedeparturesV4.<FORMAT>?key=<DIN API NYCKEL>&siteid=<SITEID>&timewindow=<TIMEWINDOW>
 
 
    */
   // let urlPlatsUppslag = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=705b323a639c43e8b11a4b3268f02f80&searchstring=<placeSearch>&stationsonly=true&maxresults=10"
    let platsId = 9192;
    let platsName = "";
   // let urlRealTidsInfo = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/realtimedeparturesV4.json?key=6bbc7dca9df1475e936001327f82bbe9&siteid="+platsId+"&timewindow=20"
    
     let platsUppslag = [];
     let stationsUl = document.getElementById("stationsUl");
     
     
     let endStation = document.getElementById("endStation")
     let bussCheckbox = document.getElementById("bussCheckbox");
     let tbanaCheckbox = document.getElementById("tbanaCheckbox");

    let searchText = document.getElementById("placeSearch");
    let btnFindStations = document.getElementById("btnFindStations");

    let UlTimeTable = document.getElementById("timeTable")


    // Söker stationer
    btnFindStations.onclick=()=>{
       getPlatsUppslag(searchText.value);
    }


    // Väljer station
    stationsUl.onclick = (e) =>{
        let li =document.getElementsByClassName("li")
        if(e.target.className == "li"){
            for(i=0;i<li.length;i++){
                li[i].id = "";
            }
            e.target.id = "selectedStation";
            platsId = e.target.value;
            platsName = e.target.name;
        }
    }


    // Söker avgångar
    let btnGetTimeTable = document.getElementById("btnGetTimeTable");
    btnGetTimeTable.onclick =()=>{
        getRealTimeInfo(platsId)
        document.getElementById("platsInfo").innerHTML = platsName;
        let id = platsId;
        
        setInterval(() => {
            UlTimeTable.innerHTML = "Laddar..."
            getRealTimeInfo(id)
            console.log("updated timetable")
        }, 60*1000);
    }

   
    let _responseData = [];
    let timeTable = [];
  

    // Skapar avgångar genom transportmedel-lista
    function addTransportModeTimes(transportModeList){
        for(i=0; i<transportModeList.length;i++){
            let transportmedel="";
            if(transportModeList[i].TransportMode == "BUS")
            transportmedel = "Buss"
            if(transportModeList[i].TransportMode == "METRO")
            transportmedel = "T-bana"
        let departure = {
            transportmode: transportmedel,
            linenumber: transportModeList[i].LineNumber,
            destination: transportModeList[i].Destination,
            displaytime: transportModeList[i].DisplayTime}
        timeTable.push(departure);
        }
    }


    // hämtar stationer
    function getPlatsUppslag(placeName){
        let urlPlatsUppslag =  "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=705b323a639c43e8b11a4b3268f02f80&searchstring="+placeName+"&stationsonly=true&maxresults=10"
        fetch(urlPlatsUppslag)
        .then((resp)=>resp.json())
        .then (function(data){
            platsUppslag = data.ResponseData;
            console.log(platsUppslag);
            stationsUl.innerHTML = "";
         })
         .then(function(){
             for(i=0;i<platsUppslag.length;i++){
                 let li = document.createElement("li");
                 li.innerHTML = platsUppslag[i].Name;
                 li.value = platsUppslag[i].SiteId;
                 li.className="li";
                 li.name = platsUppslag[i].Name;
                 stationsUl.appendChild(li)
             }
         }
         )
        .catch(function(error){
        console.log(error);
        stationsUl.innerHTML = error.name +"<br>Förmodligen för många API-anrop:)";
        
        });
    }


    // Hämtar tidtabell
    function getRealTimeInfo(platsId){
        let urlRealTidsInfo = "https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/realtimedeparturesV4.json?key=6bbc7dca9df1475e936001327f82bbe9&siteid="+platsId+"&timewindow=59"
        fetch(urlRealTidsInfo)
        .then((resp)=>resp.json())
        .then(function(data){
            _responseData = [];
            _responseData = data.ResponseData;
        }).then(function(){
            timeTable = [];
            // Bussar - tidtabell
            if(bussCheckbox.checked == true)
            addTransportModeTimes(_responseData.Buses)
            // Tunnelbana - tidtabell
            if(tbanaCheckbox.checked == true)
            addTransportModeTimes(_responseData.Metros)
            // Filtrerar med Ändhållplats
            if(endStation.value !== ""){
                let endTimeTable = [];
                for(i=0;i<timeTable.length;i++){
                    if(timeTable[i].destination == endStation.value){
                        endTimeTable.push(timeTable[i]);
                    }
                }
                timeTable = endTimeTable;
            }
        }).then(function(){
            appendTimeTable(timeTable)
        })
        .catch(function(error){
            console.log(error);
            let UlTimeTable = document.getElementById("timeTable")
            UlTimeTable.innerHTML = error.name + "<br>Välj en station-"+
             "<br>Eller så har det blivit för många API-anrop:)"
           });
    }


        // Lägger till tidtabell Frontend
        function appendTimeTable(_timeTable){
       
            let UlTimeTable = document.getElementById("timeTable")
            UlTimeTable.innerHTML = "";  
    
            for(i=0; i<timeTable.length;i++){
            let li = document.createElement("li");
            let tmode = document.createElement("label");
            let num = document.createElement("label");
            let destination = document.createElement("label");
            let displaytime = document.createElement("label");
            tmode.innerHTML = _timeTable[i].transportmode;
            num.innerHTML = _timeTable[i].linenumber;
            destination.innerHTML = _timeTable[i].destination;
            displaytime.innerHTML = _timeTable[i].displaytime;
            li.appendChild(tmode);
            li.appendChild(num);
            li.appendChild(destination);
            li.appendChild(displaytime);
            li.className = "departure";
            UlTimeTable.appendChild(li);
            }
        }

