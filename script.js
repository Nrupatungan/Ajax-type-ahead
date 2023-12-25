const suggestions = document.querySelector('.suggestions')
const searchInput = document.querySelector('.search')

const cities = [];

document.addEventListener('readystatechange', e => {
    if (e.target.readyState === 'complete'){
        console.log("ready state: complete")
        json_Fetch();
    }
})

async function json_Fetch(){
    const API_Request = new Request("https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json")

    const fetch_Response = await fetch(API_Request)

    const res_Obj = await fetch_Response.json()

    cities.push(...res_Obj)
}

function findMatches(wordToMatch, cities){
    return cities.filter(place => {
        const regex = new RegExp(wordToMatch, 'gi')
        return place.city.match(regex) || place.state.match(regex)
    })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function displayMatches(){
    const matchArray = findMatches(this.value, cities)
    let html;

    if(this.value.trim() === ''){
        html = `
        <li>Filter for a city</li>
        <li>or a state</li>
        `
    }else{
        html = matchArray.map(place => {
            const regex = new RegExp(this.value, 'gi')
            const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
            const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
    
            return `
                <li>
                    <span class="name">${cityName}, ${stateName}</span>
                    <span class="population">${numberWithCommas(place.population)}</span>
                </li>
            `
        }).join('')
    }
    suggestions.innerHTML = html;
}

searchInput.addEventListener('change', displayMatches)
searchInput.addEventListener('keyup', displayMatches)