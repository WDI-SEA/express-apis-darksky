// Display loading spinner while waiting
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.form-container').addEventListener('submit', (e) => {
    document.querySelector('.form-container').classList.add('hide');
    document.querySelector('.loading').classList.remove('hide');
  });
});