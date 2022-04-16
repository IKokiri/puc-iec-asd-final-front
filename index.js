const btnSearch = document.querySelector("#search")

var magnetModal = new bootstrap.Modal(document.getElementById('magnetModal'), {
    keyboard: false
})

let allMovies = []

const getMovieDataById = (id) => {
    const movie = allMovies.filter(movie => movie.id == id)
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
                    Magnet
                </button>
            </td>
        </tr>`
    }
    document.querySelector('table tbody').innerHTML = tr
}

const search = async (term) => {

    const data = await fetch(`http://localhost:4000/search/${term}`)
        .then(data => {
            return data.json()
        })
        .catch(err => {
            // Catch and display errors
        })

    return data
}

const getDataMovie = async (id) =>{
    const movieData = getMovieDataById(id)
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
        <a class='btn btn-link' href='${magnet}'>Download ${count++}</a>
        </div>
        `
    }
    document.querySelector('.modal-body').innerHTML = magnetLinks
    magnetModal.show()
}

const getMagnet = async (movieData) => {

    const magnets = await fetch('http://localhost:4000/search/magnet', {
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