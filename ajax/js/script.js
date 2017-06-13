
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street = $('#street');
    var $city = $('#city')
    var urlStreetView;
    var $bgimg = $('.bgimg');
    var wikiApi, nytimesAPI;


    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    if ($street.val()){
        urlStreetView = "http://maps.googleapis.com/maps/api/streetview?";
        urlStreetView += $.param({
            size: "640x640",
            location: $street.val()+ ', ' +$city.val()
        })

        console.log(urlStreetView)
        $(".bgimg").remove()
        $body.append('<img class="bgimg" src="'+ urlStreetView +'" />')

    }

    // YOUR CODE GOES HERE!
    nytimesAPI = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
        nytimesAPI += $.param({
          'q': $street.val()+ ', ' +$city.val(),
          'sort':"newest",
          'api-key': "62663ca04cb84a028270428e7da6d116"
        });

    function addArticle(data){
        var docs = data.response.docs;
        $nytHeaderElem.text('New York Times Articles About ' + $city.val())
        docs.forEach(function(doc){
        $nytElem.append(`<li class="article">
            <a href="${doc.web_url}">
                ${doc.headline.main}
            </a>
            <p>
                ${doc.snippet}
            </p>
         </li>`)
    })
    }

    $.ajax({
      dataType: "json",
      url: nytimesAPI,
      success: addArticle,
      error: function(){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded')
      }
    })


   // WIKIPEDIA
   wikiApi = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+$city.val()+ "&format=json&callback=callback";

   function addWiki(data){
       $('#wikipedia-header').text(data[0]);
       for (var i=0; i<data[1].length; i++){
         $wikiElem.append(`
            <li >
                <a href="${data[3][i]}"> ${data[1][i]}</a>
            </li>
        `)

       }
   }

   $.ajax({
        url: wikiApi,
        dataType: "jsonp",
        success:addWiki
   })


    return false;
};

$('#form-container').submit(loadData);
