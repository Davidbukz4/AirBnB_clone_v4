$(document).ready(() => {
  const amenitiesDict = {};
  $('li input[type=checkbox]').change(() => {
    if ($(this).is(':checked')) {
      amenitiesDict[this.dataset.name] = this.dataset.id;
    } else if ($(this).is(':not(:checked)')) {
      delete amenitiesDict[this.dataset.name];
    }
    $('.amenities h4').text(Object.keys(amenitiesDict).sort().join(', '));
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function(data) {
      data.forEach((place) => {
        $('section.places').append(`
          <article>
	          <div class="title_box">
	            <h2>{{ place.name }}</h2>
	            <div class="price_by_night">${{ place.price_by_night }}</div>
	          </div>
	          <div class="information">
	            <div class="max_guest">{{ place.max_guest }} Guest{% if place.max_guest != 1 %}s{% endif %}</div>
              <div class="number_rooms">{{ place.number_rooms }} Bedroom{% if place.number_rooms != 1 %}s{% endif %}</div>
              <div class="number_bathrooms">{{ place.number_bathrooms }} Bathroom{% if place.number_bathrooms != 1 %}s{% endif %}</div>
	          </div>
	          <div class="user">
              <b>Owner:</b> {{ place.user.first_name }} {{ place.user.last_name }}
            </div>
            <div class="description">
	            {{ place.description | safe }}
            </div>
	        </article>
          `)
      })
    },
});

});
