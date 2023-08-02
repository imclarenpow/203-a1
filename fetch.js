//the overpowering variable that must see all
let jsonData;
let sortByValue;

document.addEventListener('DOMContentLoaded', () => {
  //method that deals with the checkbox checking, moved because it was taking up space
  allCheckboxChecker();
  //initial fetcher, just realised this is important otherwise no birds 
  //will be seen until sort or filters are used
  fetchAndSort();
  const sortBySel = document.getElementById('sort');
  const filterUse = document.getElementById('checkbox-group');
  filterUse.addEventListener('change', (event) =>{
    const filterValues = checkChange(event);
    filterLogic(filterValues);
  });
  //so that i can use the return value to push into the fetcher.
  sortBySel.addEventListener('change', (event) => {
    sortByValue = sortChange(event);
    fetchAndSort();
  });
});

//this is the checkbox logic for the checkboxes
function checkChange(event) {
  const filterUse = document.getElementById('checkbox-group');
  const checkedCheckboxes = getCheckedCheckboxes(filterUse);
  console.log(checkedCheckboxes);
  return checkedCheckboxes;
}
function getCheckedCheckboxes(container){
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
  return checkedCheckboxes.map(checkbox => checkbox.value);
}
//sort change logic and stuff
function sortChange(event) {
  const sortByWord = event.target.value;
  if (sortByWord === 'name') {
    return 0;
  } else if (sortByWord === 'weight') {
    return 1;
  } else if (sortByWord === 'length') {
    return 2;
  }
}
async function filterLogic(applied){
  fetcher();
  jsonData.forEach(bird => {
    console.log('bird-name');
  });
}
async function fetchAndSort(){
  await fetcher();
  sorter(sortByValue);
}
async function fetcher() {
  const cardContainer = document.getElementById('cardContainer');
  //remove previous containers made and stuff
  cardContainer.innerHTML = '';
  try {
    const response = await fetch('data/nzbird.json');
    jsonData = await response.json();
  } catch (error) {
    console.error('Error when trying to fetch nzbird.json data', error);
  }
  sorter(sortByValue);
  
}

function sorter(sortValue){
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
    // sorter is last so it creates the bird cards etc
      jsonData.forEach(bird => {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');
        const card = createBirdCard(bird);
        cardWrapper.appendChild(card);
        cardContainer.appendChild(cardWrapper);
      });
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

function allCheckboxChecker(){
  //logic to make the all check check all boxes, and unselect uncheck all boxes
  const allCheckbox = document.getElementById('all-check');
  const checkboxes = document.querySelectorAll('#checkbox-group input[type="checkbox"]');
  //checks on change for the checkbox on whether or not to check the other boxes
  allCheckbox.addEventListener('change', () => {
    checkboxes.forEach(checkbox => checkbox.checked = allCheckbox.checked);
  });
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (!checkbox.checked) {
        allCheckbox.checked = false;
      } else {
        const allUnchecked = Array.from(checkboxes).every(checkbox => !checkbox.checked);
        allCheckbox.checked = !allUnchecked;
      }
      const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
      if (!checkbox.checked && allCheckbox.checked && !allChecked) {
        allCheckbox.checked = false;
      }
    });
  });
}
  