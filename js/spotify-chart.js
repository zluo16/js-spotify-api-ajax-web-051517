var url = "https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/top-tracks?country=SE";

var dataSetProperties = {
  fillColor: 'rgba(220,220,220,0.5)',
  strokeColor: 'rgba(220,220,220,0.8)',
  highlightFill: 'rgba(220,220,220,0.75)',
  highlightStroke: 'rgba(220,220,220,1)'
};

var accessToken

$(function() {
  getAccessToken();
});

// write functions to pass spec tests here outside the jQuery doc ready
// then call function within doc ready to get them to work
// and display the chart correctly in index.html

function extractTop10Tracks(tracks) {
  tracks.sort(function(track1, track2) {
    return track2.popularity - track1.popularity
  })
  return tracks.slice(0, 10)
}

function extractPopularity(tracks) {
  return tracks.map(function(track) {
    return track.popularity
  })
}

function extractNames(tracks) {
  return tracks.map(function(track) {
    return track.name
  })
}

function chartData(labels, inputData) {
  return {
    labels: labels,
    datasets: [
      {
        fillColor: 'rgba(220,220,220,0.5)',
        strokeColor: 'rgba(220,220,220,0.8)',
        highlightFill: 'rgba(220,220,220,0.75)',
        highlightStroke: 'rgba(220,220,220,1)',
        data: inputData
      }
    ]
  }
}

function getSpotifyTracks(callback){
  $.ajax({
    url: url,
    type: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    success: callback
  })
}

function getAccessToken() {
  $.ajax({
    url: 'https://accounts.spotify.com/api/token',
    type: 'POST',
    data: {'grant_type': 'client_credentials'},
    headers: {
      Authorization: 'Basic MmEyN2U4Mjc4OTE0NDRhYmExYzFhMjY3MWViOTE2NGI6Yjg4Y2UyNDY4ZjkxNGVmMDg1NTk0NDhiMGI1ZjA2YmY='
    },
    success: function(data) {
      accessToken = data.access_token
      getSpotifyTracks(success)
    }
  })
}

function success(parsedJSON) {
  let tracks = parsedJSON.tracks
  let topTen = extractTop10Tracks(tracks)
  let trackPop = extractPopularity(topTen)
  let topTenNames = extractNames(topTen)
  let chartParams = chartData(topTenNames, trackPop)

  let ctx = document.getElementById('spotify-chart').getContext('2d')

  new Chart(ctx).Bar(chartParams)
}
