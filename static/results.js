const skycons = new Skycons({"color": "black"});

document.addEventListener('DOMContentLoaded', () => {
  const iconText = document.querySelector('#icon-text');
  // on Android, a nasty hack is needed: {"resizeClear": true}

  // you can add a canvas by it's ID...
  skycons.add('main-icon', iconText.textContent);

  [...document.querySelectorAll(".small-icon")].forEach((elem) => {
    skycons.add(elem, elem.getAttribute('data-icon'));
  });


  // start animation!
  skycons.play();




});
