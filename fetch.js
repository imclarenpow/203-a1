async function fetcher() {
  const cardContainer = document.getElementById('cardContainer');
  try {
    const response = await fetch('data/nzbird.json');
    const jsonData = await response.json();

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
  
  
  fetcher();
  