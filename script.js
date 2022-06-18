//Select the form in HTML
let formEl = document.querySelector("form")

//Select the button in HTML
let showMore = document.querySelector("#load-more-movies-btn")
//API key
const api_key = "9dad0c79e6342759c1bdd7f131ba4f7a"

//Page count 
let page = 1

//Prefix of image url
let imgUrl = "https://www.themoviedb.org/t/p/w188_and_h282_bestv2/"


//API link for movies now playing 
let apiNowPlaying = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=${page}`


//Number of movies fetched
let numOfMovies;


//Select empty container to store movie images and info
let displayList = document.querySelector("#movies-grid")

// Variable to see if we are on Now Playing or Searchd Page 
let searchedPage = false

let searched = ""

//Adds movie images and info to empty container
function generateMovieListHTML(data)
{
    for(let i = 0; i < numOfMovies; i++)
    {
        displayList.innerHTML += getMovieTemplate(data, i)
    }
} 


//Template for how movie info will be added to empty container 
function getMovieTemplate (movie, movie_id)
{
    //Movie image, Title, and Average rating 
    return `<div class="movie-card"> 
                <img class="movie-poster" src=${imgUrl + movie.results[movie_id].backdrop_path}> 
                <div class="movie-title">${movie.results[movie_id].original_title}</div>     
                <div class="movie-votes"> &#x2B50 ${movie.results[movie_id].vote_average}</div> 
            </div>

                  `
}

//More movies button 
const showMeMoreBtn = document.querySelector("#load-more-movies-btn")


async function nowPlayingMovies () 
{
    console.log(apiNowPlaying)
    const response = await fetch(apiNowPlaying)

    const responseData = await response.json();
    numOfMovies = responseData.results.length;

    showMeMoreBtn.classList.remove('hidden')
    generateMovieListHTML(responseData)
}
nowPlayingMovies()

// User's search begins after submitted 
formEl.addEventListener("submit", async(event) => 
{
    searchedPage = true
    //Prevents the page from reloading
    event.preventDefault()

    //Stores the search result that the user submitted
    searched = event.target.movie_search.value
    console.log("event.target.movie_search.value = ", event.target.movie_search.value)
  
    //URL for movie searched
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searched}&page=${page}`
    console.log(url)

 
    try 
    {
        const response = await fetch(url)
        const responseData = await response.json();
        numOfMovies = responseData.results.length;
        displayList.innerHTML = ""
        generateMovieListHTML(responseData)
    
    }
    catch (event) 
    {
        // generateError(event.target.movie_search.value)
        console.log(event);
    }

})

showMore.addEventListener("click", async(event) => 
{
    //Increments page to get more movies
    page++
    
    //Resets apiUrl every time the page number changes
    apiNowPlaying = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=${page}`
    
    //Resest searched url everytime the page number changes
    url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searched}&page=${page}`
    
    //Determines which page to add more to
    if (searchedPage) 
    {
        const response = await fetch(url)
        const responseData = await response.json();
        numOfMovies = responseData.results.length;
        generateMovieListHTML(responseData)
    } else 
    {
        const response = await fetch(apiNowPlaying)

        const responseData = await response.json();
        numOfMovies = responseData.results.length;

        showMeMoreBtn.classList.remove('hidden')
        generateMovieListHTML(responseData)
    }
})
