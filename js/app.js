(function() {
  'use strict';

  let movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({
        delay: 50
      }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };
  $('button').click(function() {
    let userSearch = $('input').val()

    movies = []
    if (userSearch !== '') {
      $.ajax({

        // method for the HTTP request
        method: 'GET',

        // url where the data lives
        url: `http://omdbapi.com/?s=${userSearch}`,

        // the format of data to recieve
        dataType: 'json',

        // what to do if code works
        success: function(data) {

          // use for loop to create unique obj for each movie
          for (let movie of data.Search) {
            let uniqueId = movie.imdbID

            // another ajax call to access movie plot using imdbID
            $.ajax({
              method: 'GET',
              url: `http://omdbapi.com/?i=${uniqueId}`,
              dataType: 'json',
              success: function(data2) {
                movies.push({
                  title: data2.Title,
                  year: data2.Year,
                  poster: data2.Poster,
                  id: data2.imdbID,
                  plot: data2.Plot
                })
                console.log(movies)
                renderMovies()
              },

              // what to do if code doesn't work
              error: function() {
                console.log('uh oh something went wrong')
              }
            })
          }
          renderMovies()
        },

        // what to do if code doesn't work
        error: function() {
          console.log('uh oh something went wrong')
        }
      })
    }
  });
})();
