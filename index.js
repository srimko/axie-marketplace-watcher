async function getAxies(type) {
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Origin", "https://marketplace.axieinfinity.com");
  myHeaders.append("Referer", "https://marketplace.axieinfinity.com");

  if (type === undefined) {
    type = 'axies'
  }

  const bodyRequest = {
    axies: { "operationName": "GetAxieLatest", "variables": { "from": 0, "size": 10, "sort": "Latest", "auctionType": "Sale" }, "query": "query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {    total    results {      ...AxieRowData      __typename    }    __typename  }}fragment AxieRowData on Axie {  id  image  class  name  genes  owner  class  stage  title  breedCount  level  parts {    ...AxiePart    __typename  }  stats {    ...AxieStats    __typename  }  auction {    ...AxieAuction    __typename  }  __typename}fragment AxiePart on AxiePart {  id  name  class  type  specialGenes  stage  abilities {    ...AxieCardAbility    __typename  }  __typename}fragment AxieCardAbility on AxieCardAbility {  id  name  attack  defense  energy  description  backgroundUrl  effectIconUrl  __typename}fragment AxieStats on AxieStats {  hp  speed  skill  morale  __typename}fragment AxieAuction on Auction {  startingPrice  endingPrice  startingTimestamp  endingTimestamp  duration  timeLeft  currentPrice  currentPriceUSD  suggestedPrice  seller  listingIndex  state  __typename}" },
    eggs: { "operationName": "GetAxieBriefList", "variables": { "from": 0, "size": 10, "sort": "Latest", "auctionType": "Sale", "owner": null, "criteria": { "region": null, "parts": null, "bodyShapes": null, "classes": null, "stages": [1], "numMystic": null, "pureness": null, "title": null, "breedable": null, "breedCount": null, "hp": [], "skill": [], "speed": [], "morale": [] } }, "query": "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {    total    results {      ...AxieBrief      __typename    }    __typename  }}fragment AxieBrief on Axie {  id  name  stage  class  breedCount  image  title  battleInfo {    banned    __typename  }  auction {    currentPrice    currentPriceUSD    __typename  }  parts {    id    name    class    type    specialGenes    __typename  }  __typename}" }
  }

  console.log(bodyRequest[type])

  const myInit = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(bodyRequest[type])
  };

  const response = await fetch('https://axieinfinity.com/graphql-server-v2/graphql', myInit)

  if (!response.ok) {
    throw new Error(`Erreur HTTP ! statut : ${response}`);
  }

  const json = await response.json()
  const axies = json.data.axies.results
  let localAxies = []
  axies.forEach(axie => {
    if (/([0-9]+)/.exec(axie.image) !== null) {
      localAxies.push(axie)
    } else if (/(egg)/.exec(axie.image) !== null) {
      localAxies.push(axie)
    }
  })
  const refresh = document.querySelector('.refresh')
  displayAxies(localAxies, type)
  localStorage.setItem('axies', JSON.stringify(localAxies))
  localStorage.setItem('lastUpdate', Date.now())
}

function refreshAxies(type) {
  console.log(type)
  getAxies(type).catch(e => {
    refresh.classList.remove('processing')
    console.log(e.message);
  });
}

function displayLastUpdate(timestamp) {
  let lastUpdateElement = document.querySelector('.lastUpdate')

  let unix_timestamp = localStorage.getItem('lastUpdate')
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + 'UTC'

  console.log(formattedTime);
  lastUpdateElement.textContent = formattedTime
}

function displayAxies(axies, type = 'axies') {
  let axiesHTML = ''
  axies.forEach(axie => {
    if (type === 'axies') {
      if (/([0-9]+)/.exec(axie.image) !== null) {
        axiesHTML += `<div class="axies ${axie.class.toLowerCase()}">
              <div class="header">
                <div class="axie-image" style="background-image: url(${axie.image});">
                  <img src="${axie.image}" />
                </div>
                <div>
                  <span class="${axie.class.toLowerCase()}">
                    #${axie.id}
                  </span>
                  <p>Breed count: ${axie.breedCount}</p>
                </div>
              </div>
              <div class="body">
                <a href="https://marketplace.axieinfinity.com/axie/${/([0-9]+)/.exec(axie.image)[0]}" target="_blank">${axie.name}</a>
              </div>
              <div>
                <p>Ξ 0.${axie.auction.currentPrice.slice(0, 4)} USD</p>
                <p>$${axie.auction.currentPriceUSD} USD</p>
              </div>
            </div>`
      }
    } else {
      if (/(egg)/.exec(axie.image) !== null) {
        axiesHTML += `<div class="axies ">
          <div class="header">
            <div class="axie-image" style="background-image: url(${axie.image});">
              <img src="${axie.image}" />
            </div>
            <div>
              <span class="">
                #${axie.id}
              </span>
              <p>Breed count: ${axie.breedCount}</p>
            </div>
          </div>
          <div class="body">
            <a href="https://marketplace.axieinfinity.com/axie/${axie.id}" target="_blank">${axie.name}</a>
          </div>
          <div>
            <p>Ξ 0.${axie.auction.currentPrice.slice(0, 4)} USD</p>
            <p>$${axie.auction.currentPriceUSD} USD</p>
          </div>
        </div>`
      }
    }
  })
  document.querySelector('#text').innerHTML = axiesHTML

  const refresh = document.querySelector('.refresh')
  refresh.classList.remove('processing')

  displayLastUpdate()
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('Go fetch axie\'s API')
  let type = 'axies'


  const refresh = document.querySelector('.refresh')
  const buttons = document.querySelectorAll('[data-type]')

  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      type = e.target.dataset.type
      refresh.classList.add('processing')
      getAxies(type).catch(e => {
        refresh.classList.remove('processing')
        console.log(e.message);
      });
    })
  })

  refresh.addEventListener('click', (event) => {
    console.log('Refresh')
    refreshAxies(type)
  })

  const localAxies = JSON.parse(localStorage.getItem('axies'))

  if (localAxies !== null && localAxies !== undefined && localAxies.length > 0) {
    console.log(localAxies)
    displayAxies(localAxies)
  } else {
    getAxies(type).catch(e => {
      const refresh = document.querySelector('.refresh')
      refresh.classList.remove('processing')
      console.log(e.message);
    });
  }
})
