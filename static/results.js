const skycons = new Skycons({"color": "black"});

document.addEventListener('DOMContentLoaded', () => {
  const iconText = document.querySelector('#icon-text');
  // on Android, a nasty hack is needed: {"resizeClear": true}

  // you can add a canvas by it's ID...
  skycons.add('main-icon', iconText.textContent);

  // start animation!
  skycons.play();
  console.log('icon stuff');

  // want to change the icon? no problem:
  // skycons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);

  // want to remove one altogether? no problem:
  // skycons.remove("icon2");
})