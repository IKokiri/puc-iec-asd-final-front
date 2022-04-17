const baseUrl = 'https://puc-iec-asd-nodejs.herokuapp.com/'
// const baseUrl = 'http://localhost:4000/'
const btnSearch = document.querySelector("#search")
var magnetModal = new bootstrap.Modal(document.getElementById('magnetModal'), {
    keyboard: false
})

let allMovies = []
let allMoviesVerifieds = []

const getMovieDataById = (id) => {
    const movie = allMovies.filter(movie => movie.id == id)
    return movie[0]
}

const getMovieVerifiedDataById = (id) => {
    const movie = allMoviesVerifieds.filter(movie => movie.id == id)
    return movie[0]
}

btnSearch.addEventListener("click", async () => {
    const term = document.querySelector('#term').value
    const movies = await search(term)
    allMovies = movies
    listGrid(movies)
});

const listGrid = (movies) => {
    let tr = ''
    for (let movie of movies) {
        tr +=
            `<tr>
            <td>
                ${movie.title}
            </td>
            <td>
                <button class='btn btn-success' onClick=getDataMovie('${movie.id}')>
                    Buscar Magnets
                </button>
            </td>
        </tr>`
    }
    document.querySelector('#bodySearch').innerHTML = tr
}


const listGridVerified = (movies) => {
    let tr = ''
    for (let movie of movies) {
        tr +=
            `<tr>
            <td>
                ${movie.title}
            </td>
            <td>
                <button class='btn btn-success' onClick=getDataMovieVerified('${movie.id}')>
                    Buscar Magnets
                </button>
            </td>
            <td>
                ${movie.rate+1}
            </td>
            <td>
                ${movie.verified}
            </td>
        </tr>`
    }

    document.querySelector('#bodyVerified').innerHTML = tr
}

const search = async (term) => {

    const data = await fetch(`${baseUrl}search/${term}`)
        .then(data => {
            return data.json()
        })
        .catch(err => {
            alert('Tivemos problemas ao obter essas informações, por favor, tente novamente altere a busca. vamos buscar um servidor melhor')
            // Catch and display errors
        })
    return data
}

const verifieds = async (term) => {
    
    const data = await fetch(`${baseUrl}verified/`)
        .then(data => {
            return data.json()
        })
        .catch(err => {
            // Catch and display errors
        })
        allMoviesVerifieds = data
        listGridVerified(data)
}
verifieds()

const getDataMovie = async (id) =>{
    const movieData = getMovieDataById(id)
    const magnets = await getMagnet(movieData)
   
    listMagnets(magnets)
}

const getDataMovieVerified = async (id) =>{
    const movieData = getMovieVerifiedDataById(id)
    const magnets = await getMagnet(movieData)
   
    listMagnets(magnets)
}

const listMagnets = (magnets) => {
    let magnetLinks = ''
    let count = 1
    for(let magnet of magnets){
        magnetLinks += 
        `
        <div class='row'>
        <div class='col'>
        <a class='btn btn-link' href='${magnet}'>Download ${count++}</a>
        </div>
        <div class='col'>
        <button class='btn btn-info'>Verificado</button>
        </div>
        </div>

        <br/>
        `
    }
    document.querySelector('.modal-body').innerHTML = magnetLinks
    magnetModal.show()
}

const getMagnet = async (movieData) => {

    const magnets = await fetch(`${baseUrl}search/magnet`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    })
        .then(data => {
            return data.json()
        })
        .catch(err => {
            // Catch and display errors
        })
        return magnets
}
