/*to be able to toggle between the two pages*/
function show(shown, hidden) {
    document.getElementById(shown).style.display = 'block';
    document.getElementById(hidden).style.display = 'none';
    return false;
}
$(document).ready(function() {

    // ===========================================================
    // Define variables
    var searchVal;
    var baseURL;
    var actorURL;
    var respA;
    var resp;
    var curChoice;
    var thisVal;
    var currentFilm;
    var movieID;
    var goodPic;
        // ===========================================================
  
      $(".element").typed({
        showCursor: false,
        strings: ["Like movies?  We do!  IMDB is the holy grail of movie info.", "Too bad IMDB doesn't let you watch a movie's trailer.", "Fret no more, movie lover.  Limelight is here!"],
        typeSpeed: 0
      });
 
    // Click button to do search on the Initial Page
    $('#submit').on('click', function() {
        InitialSearch();
        $('#top').hide();
    });
    //Function to make enter perform the search on the main page
    $("#actor").keypress(function(enter) {

        if (enter.keyCode === 13) {
            console.log('enter clicked');

            $('#Page1').hide();
            $('#Page2').show();
            InitialSearch();
            enter.preventDefault();
        }
    });
    //Search funtion on Page 2 to work on click
    $('#search').on('click', function() {

        $('#actor').val($('#name').val().trim());
        $('#searchContent').empty();
        InitialSearch();
    });
    //Function to make enter perform the search on the 2nd   page
/*    $("#name").keypress(function(enter) {
        if (enter.keyCode === 13) {
            $('#actor').val($('#name').val().trim());
            $('#searchContent').empty();
            InitialSearch();
            enter.preventDefault();
        }
    });*/
    //assign input value to searchVal, construct URL and run Ajax
    function InitialSearch() {
        searchVal = $('#actor').val().trim();
        searchVal = searchVal.replace(" ", "_");
        baseURL = 'http://imdb.wemakesites.net/api/search?q=' + searchVal + '&api_key=cfa2962b-0e94-49f0-a266-76045337173c'
        baseAjax = $.ajax({
            url: baseURL,
            method: 'GET',
            dataType: 'jsonp'
        }).done(function(responseA) {
            $('#info').html("");
            // ===========================================================
            // Assign respA as shortcut to results.  Loop throgh response and display name, id & thumbnail
            respA = responseA.data.results.names;
            console.log(respA)
            for (var i = 0; i < respA.length; i++) {
                $('#searchContent').append(' <div class = "well row choices" id =" ' + respA[i].id + '" ><div>' + respA[i].title + '</div><div class = "col-md-12"><img src ="' + respA[i].thumbnail + '"><button class= "info" id = "' + respA[i].id + '" data-actorname ="' + respA[i].title + '" data-moreinfoclicked = ' + '"no"' + '"  >Click to See More/Less</button></div></div>')
                console.log(respA)
            }
        });
    }
    // ===========================================================
    // Event handler to assign the id of person clicked to curChoice variable & construct URL for new Ajax
    $(document).on('click', '.info', function() {
            if ((this).dataset.moreinfoclicked === "no") {
                $(this).attr('data-moreinfoclicked', "yes");
                curChoice = (this);
                console.log(curChoice);
                ActorName = curChoice.dataset.actorname;
                console.log(ActorName);
                //console.log(curChoice);
                console.log(curChoice.id);
                thisVal = curChoice.id;
                actorURL = 'http://imdb.wemakesites.net/api/' + thisVal + '?api_key=cfa2962b-0e94-49f0-a266-76045337173c'
                actorAjax = $.ajax({
                    url: actorURL,
                    method: 'GET',
                    dataType: 'jsonp'
                }).done(function(response) {
                    // var id = $(curChoice).attr("id");
                    // ===========================================================
                    // Append description to description, loop through results & list all films
                    var ActorDetailsDiv = $('<div id="ActorDetailsDiv' + thisVal + '"></div>');
                    var ActorDescription = $('<div class="ActorDescriptionDiv">' + "Actor Description:<br><br>" + '</div>');
                    ActorDescription.append('<div class="ActorDescription">' + response.data.description + '</div>');
                    ActorDetailsDiv.append(ActorDescription);
                    for (let i = 0; i < response.data.filmography.length; i++) {
                        // goodPic = response.data.image;
                        currentFilm = response.data.filmography[i].title;
                        movieID = thisVal + currentFilm.replace(/\s/g, '');
                        var movieListItem = $('<div class="row movieListItem well"></div>');
                        var movieListItem = $('<div class="row movieListItem well" id="'+movieID+'" data-moviename="' + currentFilm + '" data-actorid="'+ thisVal+'" data-actorname="' + ActorName + '"></div>');
                        movieListItem.text(response.data.filmography[i].title);
                        // movieListItem.attr('src', response.data.image);
                        ActorDetailsDiv.append(movieListItem);
                        $("#" + thisVal).parent().append(ActorDetailsDiv);
                        console.log(response);
                    }
                    console.log(thisVal);
                    
                    console.log("about to make call");
                })
            } // end if statement for the more info call
            else {
                //toggle the amount of information shown after the initial API Call
                console.log((this).id);
                $('#ActorDetailsDiv' + (this).id).toggle();
            }
        })
        //click function that will load the movies on the screen when a movie from the list is clicked
    $(document).on('click', '.movieListItem', function() {
        $('.videoDiv').empty();
        currentFilm = (this).dataset.moviename;
        thisVal = (this).dataset.actorid;
        ActorName = (this).dataset.actorname;
        movieID = (this).id;
        console.log(currentFilm);
        //$(this).siblings().dataset.moviename.toggle();
        youtubeCall();

    });

    function youtubeCall() {
        function start() {
            console.log("working");
            console.log(thisVal);
            var query = ActorName + " " + currentFilm + " trailer";
            console.log(query);
            // Initializes the client with the API key and the Translate API.
            gapi.client.init({
                'apiKey': 'AIzaSyBbnQh0eDikVNdFFrdUrH4Olq79Ncnx_iM',
                'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
            }).then(function() {
                // Executes an API request, and returns a Promise.

                // The method name `language.translations.list` comes from the API discovery.

                var request = gapi.client.youtube.search.list({
                    q: query,
                    part: 'snippet'
                });
                return request;
            }).then(function(response) {
                console.log(response.result.items);

                var videoDiv = $('<div class="videoDiv">');

                response.result.items.forEach(function(item) {

                        //add images and snippet into the videoDiv

                        videoDiv.append('<div id="snippet">' + item.snippet.title + '</div>');
                        videoDiv.append('<img class="youtubeThumbnail" src="https://img.youtube.com/vi/' + item.id.videoId + '/default.jpg" data-videolink="https://www.youtube.com/embed/' + item.id.videoId + '?enablejsapi=1">');

                    })

                    //append the videoDiv to the DOM
                $('#' + movieID).append(videoDiv);
                //$('#' + thisVal).parent().append(videoDiv);

            }, function(reason) {
                console.log('Error: ' + reason.result.error.message);
            });
        };
        // Loads the JavaScript client library and invokes `start` afterwards.
        gapi.load('client', start);
    }


    //Clears out the modal link when you click away from the player and stops background

    $('#modal-video').on('hidden.bs.modal', function() {
        $('#modalplayer').attr("src", "");
    })

    $(document).on('click', '.youtubeThumbnail', function(e) {
        e.preventDefault();
        console.log((this).dataset.videolink);
        $('#modalplayer').attr("src", (this).dataset.videolink);

        console.log((this).dataset.videolink);
        $('#modal-video').modal();
    });

});

