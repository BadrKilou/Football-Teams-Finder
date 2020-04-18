const search = document.getElementById('search');
const submitBtn = document.getElementById('submit');
const teams = document.getElementById('teams');
const resultHeading = document.getElementById('result-heading')
const singleTeam = document.getElementById('single-team');
const random = document.getElementById('random');


function searchMeal(e){
 
    e.preventDefault();
    
    const word = search.value;
    
    if(word.trim()){
        fetch(`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${word}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<p> Search Results for '${word}'</p>`;

            if(data.teams === null){
                resultHeading.innerHTML = `<p>There are no results for '${word}'</p>`;
            } else{
                teams.innerHTML = data.teams.map(team => `
                <div class="team">
                 <img src="${team.strTeamBadge}" />
                 <div class="team-info" data-teamID="${team.idTeam}">
                 <h3>${team.strTeam}</h3>
                 <p>${team.strStadium}</p>
                 <small>${team.intFormedYear}</small>
                 </div>
                </div>

                `
                )
                .join('')
                search.value = '';
            } 
            
            
        });
    }  else{
        showAlert('Please enter something in that input')
    }

}

function showAlert(error){
    const container = document.querySelector('.container');
    const flex = document.querySelector('.flex');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.appendChild(document.createTextNode(error));
    container.insertBefore(errorDiv,flex)

    setTimeout(clear,3000)

    function clear(){
        document.querySelector('.error').remove()
    }
}
// Fetch random team from api

function randomTeam(){
    teams.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.thesportsdb.com/api/v1/json/1/lookupleague.php?id=4346`)
    .then(res => res.json())
    .then(data =>{
        const team = data.teams[0];
        addTeamToDom(team)
        e.preventDefault()
    })
}

// Event Listener

submitBtn.addEventListener('click', searchMeal);
random.addEventListener('click', randomTeam);
teams.addEventListener('click', e =>{
    const teamInfo = e.path.find(item =>{
        if(item.classList){
            return item.classList.contains('team-info')
        } else{
            false
        }
        
    })
    
    if(teamInfo){
        const teamID = teamInfo.getAttribute('data-teamid')
        GetTeamByID(teamID);
    }
})

// Fetch Team By Id 

function GetTeamByID(teamID){
    fetch(`https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=${teamID}`)
    .then(res => res.json())
    .then(data =>{
        const team = data.teams[0];

        addTeamToDom(team)
    })
}

// add team to Dom

function addTeamToDom(team){
    const teamDetails = [];
    for(let i = 1; i <= 20; i++){
        if(team[`strDescriptionEN${i}`]){
            teamDetails.push(`${team[`strDescriptionEN${i}`]} - ${team[`strStadiumDescription${i}`]}`)
        } else{
            break;
        }
    }   
    singleTeam.innerHTML= `
    <div class="single-team">
    <h1>${team.strTeam}</h1>
    <img src="${team.strTeamBadge}" alt="${team.strTeam}"  />
    <div class="single-team-info">
    <p>${team.strLeague} || ${team.intStadiumCapacity}</p>
    </div>
    <div class="main">
    <p>${team.strDescriptionEN}</p>
     <ul>
     ${teamDetails.map(t => `<li>${t}</li>`)}
     </ul>
    </div>
    </div>
    `
}