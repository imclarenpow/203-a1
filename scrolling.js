//fancy scrolling values and stuff so it doesn't feel gross
let isScrolling = false;
let lastTimestamp = 0;
let scrollAmount = 0;
let decelerationRate = 0.9;

//fancy scrolling logic, basically checks if scrolling and once wheel not being used adds decel
function scrollHorizontally(timestamp) {
  if (!isScrolling) return;

  const container = document.getElementById('cardContainer');
  const deltaTime = timestamp - lastTimestamp;
  scrollAmount *= decelerationRate;
  container.scrollLeft += scrollAmount;

  if (Math.abs(scrollAmount) > 0.1) {
    lastTimestamp = timestamp;
    requestAnimationFrame(scrollHorizontally);
  } else {
    isScrolling = false;
  }
}
//main regular old scrolling logic for horizontal scrolling (booooring no one asked)
const container = document.getElementById('cardContainer');
container.addEventListener('wheel', (event) => {
  event.preventDefault();
  isScrolling = true;
  scrollAmount += event.deltaY;
  lastTimestamp = performance.now();
  scrollHorizontally(performance.now());
});