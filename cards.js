String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.toLowerCase().slice(1);
};

var deck = {};
var cards = {};

function get_new_deck() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            deck = JSON.parse(xhr.responseText);
            get_cards(deck.deck_id);
        }
    };
    xhr.open('GET', 'http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    xhr.send();
}

function get_cards(deck_id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            cards = JSON.parse(xhr.responseText).cards;
            console.log(cards);
            show_cards(cards);
        }
    };
    xhr.open('GET', 'http://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=52');
    xhr.send();
}

function show_cards(cards) {
    var cards_wrapper = document.getElementById('cards_wrapper');
    var new_html = ""; 
    for (var i = 0; i < cards.length; i++) {
        var card_element = "<img src='{{ image }}' class='card' id='{{ card_id }}' alt='{{ alt }}'>";
        var suit = cards[i].suit.capitalizeFirstLetter();
        var value = cards[i].value.capitalizeFirstLetter();
        new_html+= card_element.replace('{{ image }}', cards[i].image)
                               .replace('{{ card_id }}', i)
                               .replace('{{ alt }}', value + " of " + suit);
    }
    cards_wrapper.innerHTML = new_html;
    var all_cards = document.getElementsByClassName('card');
    for (var j = 0; j < all_cards.length; j++) {
        all_cards[j].addEventListener('click', launchNewModal, false);

    }
}

get_new_deck();

// setting up modal

var modal_wrapper = document.getElementById('modal-wrapper');
modal_wrapper.addEventListener('click', function(e) {
    modal_wrapper.style.display = "none";
});
var modal_image = document.getElementById('modal-image');
var modal_suit = document.getElementById('modal-suit');
var modal_value = document.getElementById('modal-value');
var modal_description = document.getElementById('modal-description');


function launchNewModal(e) {
    var card_id = e.target.getAttribute('id');
    var card = cards[card_id];
    var suit = card.suit.capitalizeFirstLetter();
    var value = card.value.capitalizeFirstLetter();
    var description = value + " of " + suit;
    modal_image.setAttribute("src", card.image);
    modal_image.setAttribute("alt", description)
    modal_description.innerHTML = description;
    modal_wrapper.style.display = "block";
}
