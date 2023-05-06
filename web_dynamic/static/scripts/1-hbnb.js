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
});
