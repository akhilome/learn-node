function autocomplete(input, latInput, lngInput) {
  if (!input) return; // bail if no input on page
  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  // on user hitting 'Enter' in address field don't submit
  input.on('keydown', (e) => {
    if(e.key === 'Enter') e.preventDefault();
  });
}

export default autocomplete;
