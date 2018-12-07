// Get grid container div.
const container = document.querySelector('.container');
// Array of information recieved by fetch.
const fetches = [];
const modal = document.querySelector('#modal');
const modalWindow = document.querySelector('.modal__window');
// index stored.
let cardNumber;
let i = 0;

// Listen for outside click when modal is open.
window.addEventListener('click', clickOutside);

// Fetch Function
function fetchIt(url) {
  return fetch(url)
          .then(checkOK)
          .then(res => res.json())
          .catch(error => console.log("Fetch didn't work properly", error))
}

fetchIt('https://randomuser.me/api/?results=12&nat=us')
  .then(data => fetches.push(data))
  .then(loop => {
      // Create 12 divs with user information
      for(i; i < fetches[0].results.length; i++) {
        const results = fetches[0].results;
        const aTag = document.createElement('a');
        aTag.setAttribute("href", "#");
        container.appendChild(aTag);

        let html = `
        <div class="card" onclick="getDivIndex(this)">
          <div class="picture">
            <img src='${results[i].picture.large}'>
          </div>
          <div class="info">
            <h3 class="name">${results[i].name.first} ${results[i].name.last}</h3>
            <p class="mail">${results[i].email}</p>
            <p class="city">${results[i].location.city}</p>
          </div>
        </div>
        `;
        aTag.innerHTML = html;
      }
  })

  container.addEventListener( 'click', (e) => {
      const tag = e.target.tagName;
      const divClassName = e.target.className;
      if (tag == 'A' || divClassName == 'card' || tag == 'P' || tag == 'H3' || tag == 'IMG') {
        modalWindow.classList.add('openBox');
        openModal();
        modalWindowContent();
      }
      setTimeout( () => { modalWindow.className = "modal__window"; }, 1100);
  })

// Functions

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

// Close modal window with outside click.
function clickOutside(e) {
  if(e.target == modal) {
    modal.style.display = "none";
  }
}

// Get the index of selected card div.
function getDivIndex(div) {
  const divs = Array.prototype.slice.call( document.querySelectorAll('.card'), 0 );
  cardNumber = divs.indexOf(event.currentTarget);
}

function modalWindowContent() {
  const results = fetches[0].results;
  let modalHTML = `
    <span class="close-window">&times;</span>
    <a class="prev" onclick="actions.leftArrow()">&#10094;</a>
    <a class="next" onclick="actions.rightArrow()">&#10095;</a>
    <img class="modal-img" src='${results[cardNumber].picture.large}'>
    <h3>${results[cardNumber].name.first} ${results[cardNumber].name.last}</h3>
    <p class="modal-p">${results[cardNumber].email}</p>
    <p class="modal-p modal-p-border">${results[cardNumber].location.city}</p>

    <p class="modal-p2 modal-p2-top">${results[cardNumber].cell}</p>
    <p class="modal-p2 location">${results[cardNumber].location.street} ${results[cardNumber].location.city}, ${results[cardNumber].location.state} ${results[cardNumber].location.postcode}</p>
    <p class="modal-p2">Birthday: ${results[cardNumber].dob.date.substring(0, 10)}</p>
  `;
  modalWindow.innerHTML = modalHTML;
  const closeBtn = document.querySelector('.close-window');
  closeBtn.addEventListener('click', closeModal);
}

function checkOK(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

// Search for member names or usernames.
function searchFunction() {
    const input = document.querySelector('.search');
    const searchValue = input.value.toUpperCase();
    // Get all links.
    const links = container.querySelectorAll('a');

    for (let i = 0; i < links.length; i++) {
        let headlineName = links[i].querySelectorAll("h3")[0];
        // Get the usernames of each member.
        let username = fetches[0].results[i].login.username;
        if (headlineName.innerHTML.toUpperCase().indexOf(searchValue) > -1 || username.toUpperCase().indexOf(searchValue) > -1) {
            links[i].style.display = "";
        } else {
            links[i].style.display = "none";
        }
    }
}

function addAnimation(animationType) {
  modalWindow.classList.add(`${animationType}`);
  actions.newInfo();
}

const actions = {
  // New member content.
  newInfo: () => {
    modalWindow.innerHTML = '';
    modalWindowContent();
  },
  // Next user when the right arrow is clicked inside the modal window.
  rightArrow: () => {
    if(cardNumber < fetches[0].results.length - 1) {
      cardNumber += 1;
      addAnimation("nextBox");
    } else if(cardNumber == fetches[0].results.length - 1) {
        cardNumber = 0;
        addAnimation("nextBox");
    }
    setTimeout( () => { modalWindow.className = "modal__window"; }, 1600);
  },
  // Previous user when the left arrow is clicked inside the modal window.
  leftArrow: () => {
    if(cardNumber > 0) {
      cardNumber -= 1;
      addAnimation("prevBox");
    } else if(cardNumber == 0) {
      cardNumber = fetches[0].results.length - 1;
      addAnimation("prevBox");
    }
    setTimeout( () => { modalWindow.className = "modal__window"; }, 1600);
  }
};
