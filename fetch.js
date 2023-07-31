async function fetcher(){
    const cardContainer = document.getElementById('cardContainer');
    try {
        const response = await fetch('data/nzbird.json');
        const jsonData = await response.json();

        jsonData.forEach(bird => {
            const card = createBirdCard(bird);
            cardContainer.appendChild(card);
        });

    }catch (error) {
        console.error('error when trying to fetch nzbird.json data', error);
    }
}

function createBirdCard(bird){
    const card = document.createElement('div');
    card.classList.add('card-container');

    const image = document.createElement('img');
    image.classList.add('bird-image');
    image.src = bird.photo.source;
    image.alt = bird.english_name;

    const name = document.createElement('div');
    name.classList.add('bird-name');
    type.textContent = bird.scientific_name;

    const description = document.createElement('div');
    description.classList.add('bird-description');
    description.textContent = bird.other_names[0] + ', ' + 'is a bird species belonging to the family ' + bird.family + '. ' + 'It is about ' + bird.size.length.value + ' ' + bird.size.length.units + ' long and weights approximately ' + bird.size.weight.value + ' ' + bird.size.weight.units + '. ' + bird.english_name + ' is classified as "' + bird.status + '" and is found in the order ' + bird.order + '.';

    const photoCred = document.createElement('div');
    photoCred.classList.add('photo-credit');
    photoCred.textContent = 'Photo Credit: ' + bird.photo.credit;

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(description);
    card.appendChild(photoCredit);

    return card;
}
fetcher();