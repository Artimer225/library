const library = [];

// let's pretend that we receive unformatted data from the DB
function Book(title, author, pages, language, read) {
    if (!(new.target)) {
        throw Error('book objects can only be created using new () operator')
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.language = language;
    this.status = read;
    this.id = self.crypto.randomUUID();
}

// and now we format this data for the frontend
function BookForDisplay(book) {
    this.title = book.title;
    this.author = 'Author: ' + book.author;
    this.pages = 'Pages: ' + book.pages;
    this.language = 'Language: ' + book.language;
    this.status = 'Status: ';
    if (book.status === 1) {
        this.status += 'Currently reading';
    } if (this.status === 2) {
        this.status += 'Read';
    } else {
        this.status += 'Not read';
    }
    this.id = book.id;
}


// dummy cards for testing purposes
let firstBook = new Book('The Hobbit', 'J. R. R. Tolkien', 356, 'English', 2);
let secondBook = new Book('Crime and Punishment', 'Fyodor Dostoevsky', 488, 'Russian', 0)
let thirdBook = new Book('1984', 'George Orwell', 328, 'English', 2)

library.push(firstBook, secondBook, thirdBook);

let newLibrary = [];
for (let i = 0; i < library.length; i++) {
    newLibrary.push(new BookForDisplay(library[i]))
}

let cardholder = document.querySelector('.cardholder');

function addButtons(card) {
    let cardBtns = document.createElement('div');
    cardBtns.classList.add('card-btns');
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete Book';
    let changeBtn = document.createElement('button');
    changeBtn.classList.add('change-btn');
    changeBtn.textContent = 'Change Status';

    deleteBtn.setAttribute('data-id', card.dataset.id);
    changeBtn.setAttribute('data-id', card.dataset.id);

    cardBtns.appendChild(deleteBtn);
    cardBtns.appendChild(changeBtn);
    card.appendChild(cardBtns);
}

function displayLibrary(lib) {
    if (!(Array.isArray(lib))) {
        lib = [lib];
    }
    for (let i = 0, libLength = lib.length; i < libLength; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        let valuesOfBook = Object.values(lib[i]);
        for (let j = 0; j < valuesOfBook.length; j++) {
            let p = document.createElement('p');
            if (j === 0) {
                p.classList.add('title');
                p.innerText = valuesOfBook[j];
             card.appendChild(p)
            } else if (j === valuesOfBook.length - 1) {
                card.setAttribute('data-id', valuesOfBook[j]);
            } else {
                p.innerText = valuesOfBook[j];
                card.appendChild(p)
            }
         }
        addButtons(card);
        cardholder.appendChild(card)
    }
}

displayLibrary(newLibrary)

const showDialog = document.getElementById('showDialog');
const bookDialog = document.getElementById('dialog');
const bookForm = document.getElementById('book-dialog-form');
const closeBtn = document.getElementById('close-btn');
let deleteBtn = document.querySelectorAll('.delete-btn');

deleteBtn.forEach(btn => btn.addEventListener('click', () => {
    let currentCardId = btn.parentElement.parentElement.dataset.id;
    let currentCard = document.querySelector(`[data-id="${currentCardId}"]`);
    currentCard.remove()
}))

showDialog.addEventListener('click', () => {
    bookDialog.showModal();
})

closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bookForm.reset();
    bookDialog.close();
})

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    let tempArray = [];
    for (let value of formData.values()) {
        tempArray.push(value)
    }
    let tempBook = new Book(...tempArray)
    let formBook = new BookForDisplay(tempBook)
    displayLibrary(formBook)
    bookDialog.close();
    bookForm.reset()
})

