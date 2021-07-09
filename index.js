function getAxies() {
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Origin", "https://marketplace.axieinfinity.com");
  myHeaders.append("Referer", "https://marketplace.axieinfinity.com");

  const myInit = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ "operationName": "GetAxieLatest", "variables": { "from": 0, "size": 10, "sort": "Latest", "auctionType": "Sale" }, "query": "query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {    total    results {      ...AxieRowData      __typename    }    __typename  }}fragment AxieRowData on Axie {  id  image  class  name  genes  owner  class  stage  title  breedCount  level  parts {    ...AxiePart    __typename  }  stats {    ...AxieStats    __typename  }  auction {    ...AxieAuction    __typename  }  __typename}fragment AxiePart on AxiePart {  id  name  class  type  specialGenes  stage  abilities {    ...AxieCardAbility    __typename  }  __typename}fragment AxieCardAbility on AxieCardAbility {  id  name  attack  defense  energy  description  backgroundUrl  effectIconUrl  __typename}fragment AxieStats on AxieStats {  hp  speed  skill  morale  __typename}fragment AxieAuction on Auction {  startingPrice  endingPrice  startingTimestamp  endingTimestamp  duration  timeLeft  currentPrice  currentPriceUSD  suggestedPrice  seller  listingIndex  state  __typename}" })
  };

  fetch('https://axieinfinity.com/graphql-server-v2/graphql', myInit)
    .then((req, res) => {
      req.json().then(r => {
        const axies = r.data.axies.results

        let localAxies = []
        axies.forEach(axie => {
          if (/([0-9]+)/.exec(axie.image) !== null) {
            localAxies.push(axie)
          }
        })
        displayAxies(localAxies)
        localStorage.setItem('axies', JSON.stringify(localAxies))
        localStorage.setItem('lastUpdate', Date.now())
      })
    })
    .catch(error => {
      console.log(error)
    })
}

function refreshAxies() {
  getAxies()
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

function displayAxies(axies) {
  let axiesHTML = ''
  axies.forEach(axie => {
    console.log(axie)
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
  })
  document.querySelector('#text').innerHTML = axiesHTML

  displayLastUpdate()
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('Go fetch axie\'s API')

  const refresh = document.querySelector('.refresh')

  refresh.addEventListener('click', (event) => {
    console.log('Refresh')
    refreshAxies()
  })

  const localAxies = JSON.parse(localStorage.getItem('axies'))

  if (localAxies !== null && localAxies !== undefined && localAxies.length > 0) {
    console.log(localAxies)
    displayAxies(localAxies)
  } else {
    getAxies()
  }
})
