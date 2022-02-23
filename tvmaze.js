async function searchShows(query) {
  const res = await axios.get('https://api.tvmaze.com/search/shows', {params: {q: query}});
  return res.data;
};


// Populate shows list - given list of shows, add shows to DOM
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    const url = show.show.image ? show.show.image.medium : 'https://tinyurl.com/tv-missing';

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.show.id}">
         <div class="card" data-show-id="${show.show.id}">
            <img class="card-img-top" src="${url}">
            <div class="card-body">
              <h5 class="card-title">${show.show.name}</h5>
              <p class="card-text">${show.show.summary}</p>
            </div>
            <button class="episodes">Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);
  };
};


// Given a show ID, return list of episodes: { id, name, season, number }
async function getEpisodes(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  return res.data;
};


// Given an array of episodes, populate into #episodes-list
function populateEpisodes(episodes) {
  const ul = document.querySelector('#episodes-list');
  ul.innerHTML = '';
  for(let episode of episodes) {
    const li = document.createElement('li');
    li.innerText = `${episode.name} (Season ${episode.season} Episode ${episode.number})`;
    ul.append(li);
  };
  $("#episodes-area").show();
};


// Listen for click on episodes button and display episodes of current show at bottom of page
document.querySelector('#shows-list').addEventListener('click', async function(e) {
  if(e.target.className === 'episodes') {
    let episodes = await getEpisodes(e.target.parentElement.dataset.showId);
    populateEpisodes(episodes);
  }
})


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});