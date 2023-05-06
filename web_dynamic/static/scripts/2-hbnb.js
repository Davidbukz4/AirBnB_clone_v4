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
});
