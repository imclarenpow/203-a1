let jsonData;
let searchVal = '';
let filterVal = [];
let sortVal = 'name';

document.addEventListener('DOMContentLoaded', () => {
    timingRegulator();
    allCheck();
    const search = document.getElementById('search-bar');
    const filter = document.getElementById('checkbox-group');
    const sort = document.getElementById('sort');
    
    search.addEventListener('change', (event) => {
        searchVal = event.target.value;
        timingRegulator();
    });
    filter.addEventListener('change', (event) => {
        allCheck();
        timingRegulator();
    });
    sort.addEventListener('change', (event) => {
        sortVal = event.target.value;
        timingRegulator();
    });
});

async function timingRegulator() {
    await fetcher();
    const filteredData = searchLogic();
    const filteredAndSortedData = filterLogic(filteredData);
    const finalData = sortLogic(filteredAndSortedData);
    htmlWriter(finalData);
}

async function fetcher(){
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';
    try{
        const resp = await fetch('data/nzbird.json');
        jsonData = await resp.json();
    }catch(error){
        console.error('Fetch Error', error);
    }
}

function searchLogic(){
    const searchValP = _.deburr(searchVal.toLowerCase());
    return jsonData.filter(bird => {
        const primNameP = _.deburr(bird.primary_name.toLowerCase());
        const engNameP = _.deburr(bird.english_name.toLowerCase());
        return primNameP.includes(searchValP) || engNameP.includes(searchValP);
    });
}

function filterLogic(filteredData){
    const filters = document.getElementById('checkbox-group');
    const checks = filters.querySelectorAll('input[type="checkbox"]');
    const rawData = Array.from(checks).filter(checkbox => checkbox.checked);
    const filterValue = rawData.map(checkbox => checkbox.value);
    return filteredData.filter(bird => filterValue.includes(bird.status));
}

function sortLogic(filteredAndSortedData){
    if (sortVal === 'weight') {
        return filteredAndSortedData.sort((a, b) => a.size.weight.value - b.size.weight.value);
    } else if (sortVal === 'length') {
        return filteredAndSortedData.sort((a, b) => a.size.length.value - b.size.length.value);
    } else {
        return filteredAndSortedData.sort((a, b) => a.primary_name.localeCompare(b.primary_name));
    }
}

function htmlWriter(finalData){
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';
    finalData.forEach(bird => {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');
        const card = createBirdCard(bird);
        cardWrapper.appendChild(card);
        cardContainer.appendChild(cardWrapper);
    });
}
// individual bird card creation
function createBirdCard(bird){
    const card = document.createElement('div');
    card.classList.add('card-container');

    const image = document.createElement('img');
    image.classList.add('bird-image');
    image.src = bird.photo.source;
    image.alt = bird.english_name;

    const name = document.createElement('div');
    name.classList.add('bird-name');
    if(_.deburr(bird.primary_name.toLowerCase()) === _.deburr(bird.english_name.toLowerCase())){
        name.textContent = bird.primary_name;
    }else{
        name.innerHTML = bird.primary_name + '<br>' + bird.english_name;
    }
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
    card.classList.add(bird.status.replace(/\s/g, '').toLowerCase());
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

function allCheck(){
    const allCheckbox = document.getElementById('all-check');
    const checkboxes = document.querySelectorAll('#checkbox-group input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    allCheckbox.checked = allChecked;

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