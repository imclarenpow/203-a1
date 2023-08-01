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
//main regular old scrolling logic for horizontal scrolling
const container = document.getElementById('cardContainer');
container.addEventListener('wheel', (event) => {
  event.preventDefault();
  isScrolling = true;
  scrollAmount += event.deltaY;
  lastTimestamp = performance.now();
  scrollHorizontally(performance.now());
});

// inital fetch (name)
fetch(0);
// makes the page change with the sort button being used
document.addEventListener('DOMContentLoaded', () => {
  const sortBySel = document.getElementById('sort');
  sortBySel.addEventListener('change', sortChange);
  fetcher(sortBySel.value);
});
function sortChange(event) {
  const sortByValue = event.target.value;
  if (sortByValue === 'name') {
    fetcher(0);
  } else if (sortByValue === 'weight') {
    fetcher(1);
  } else if (sortByValue === 'length') {
    fetcher(2);
  }
}

async function fetcher(sortValue) {
  const cardContainer = document.getElementById('cardContainer');
  //remove previous containers made and stuff
  cardContainer.innerHTML = '';
  try {
    const response = await fetch('data/nzbird.json');
    const jsonData = await response.json();
  //lets chuck in a couple of sorting statements just to check they
  //work the way they should SKUX! they do
  if(sortValue===0){
    //sort by name (Maori) thanks stackoverflow for this one
    jsonData.sort(function(a,b){
      return a.primary_name > b.primary_name ? 1: (a.primary_name === b.primary_name ? 0 : -1);
    });
  }else if(sortValue===1){
  //sort by weight 
    jsonData.sort(function(a,b){
      return a.size.weight.value - b.size.weight.value;
    });
  }else if(sortValue===2){
  //sort by length
    jsonData.sort(function(a,b){
      return a.size.length.value - b.size.length.value;
    });
  }
    jsonData.forEach(bird => {
      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('card-wrapper');
      const card = createBirdCard(bird);
      cardWrapper.appendChild(card);
      cardContainer.appendChild(cardWrapper);
    });
  } catch (error) {
    console.error('Error when trying to fetch nzbird.json data', error);
  }
}
  
function createBirdCard(bird) {
    const card = document.createElement('div');
    card.classList.add('card-container');
  
    const image = document.createElement('img');
    image.classList.add('bird-image');
    image.src = bird.photo.source;
    image.alt = bird.english_name;
  
    const name = document.createElement('div');
    name.classList.add('bird-name');
    name.textContent = bird.primary_name;
  
    const type = document.createElement('div');
    type.classList.add('bird-type');
    type.textContent = bird.scientific_name;
  
    const statsList = document.createElement('ul');
    statsList.classList.add('bird-stats');
    const otherNames = bird.other_names.slice(0,3).join(', ');
    const stats = {
      'Other Names': otherNames,
      'Family': bird.family,
      'Size': bird.size.length.value + ' ' + bird.size.length.units,
      'Weight': bird.size.weight.value + ' ' + bird.size.weight.units,
      'Status': bird.status,
      'Order': bird.order
    };
  
    for (const stat in stats) {
      const listItem = document.createElement('li');
      const statLabel = document.createElement('span');
      const statData = document.createElement('span');
  
      statLabel.classList.add('stat-label');
      statLabel.textContent = stat + ':';
  
      statData.textContent = stats[stat];
  
      listItem.appendChild(statLabel);
      listItem.appendChild(statData);
      statsList.appendChild(listItem);
    }
  
    const photoCredit = document.createElement('div');
    photoCredit.classList.add('bird-credit');
    photoCredit.textContent = 'Photo Credit: ' + bird.photo.credit;
  

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(type);
  card.appendChild(statsList);
  card.appendChild(photoCredit);

  return card;
}
  