const library = [];
class Book {
    constructor(title, author, pages, language, read) {
        this.title = title;
        this.author = 'Author: ' + author;
        this.pages = 'Pages: ' + pages;
        this.language = 'Language: ' + language;
        this.status = ['Status: ',];
        if (read === '1') {
            this.status[0] += 'Currently reading';
            this.status.push('1');
        } else if (read === '2') {
            this.status[0] += 'Read';
            this.status.push('2');
        } else {
            this.status[0] += 'Not read';
            this.status.push('0');
        }
        this.id = self.crypto.randomUUID();
    }

    get readStatus() {
        return this.status[0];
    }

    set readStatus(status) {
        this.status[0] = status;
    }

    get readValue() {
        return this.status[1];
    }

    set readValue(value) {
        this.status[1] = value;
    }
}

// dummy cards for testing purposes
let firstBook = new Book('The Hobbit', 'J. R. R. Tolkien', '356', 'English', '2');
let secondBook = new Book('Crime and Punishment', 'Fyodor Dostoevsky', '488', 'Russian', '0')
let thirdBook = new Book('1984', 'George Orwell', '328', 'English', '2')

library.push(firstBook, secondBook, thirdBook);


class LibraryDisplay {
    constructor () {
        // get all HTML elements
        this.cardholder = document.querySelector('.cardholder');
        const showDialog = document.getElementById('showDialog');
        const bookDialog = document.getElementById('create-dialog');
        const bookForm = document.getElementById('book-dialog-form');
        const closeBtn = document.getElementById('close-btn');

        // apply needed event listeners
        this.cardholder.addEventListener('click', e => {
            if (e.target.matches('.delete-btn')) {
                let currentCardId = e.target.closest('.card').dataset.id;
                let currentCard = document.querySelector(`[data-id="${currentCardId}"]`);
                currentCard.remove()
                const isId = (book) => book.id === currentCardId;
                const libId = library.findIndex(isId);
                // const formLibId = formLibrary.findIndex(isId);
                library.splice(libId, 1);
                // formLibrary.splice(formLibId, 1);
            }
        })

        this.cardholder.addEventListener('click', e => {
            if (e.target.matches('.change-btn')) {
                let currentCardId = e.target.closest('.card').dataset.id;
                const isId = (book) => book.id === currentCardId;
                const currentBook = library[library.findIndex(isId)];
                const currentStatus = currentBook.readValue
                let parentDiv = e.target.closest('.change-status');
                parentDiv.querySelector('[name="status"]').options[currentStatus].selected = true;
                parentDiv.firstChild.showModal();
            }
        })

        this.cardholder.addEventListener('submit', e => {
            if (e.target.matches('.change-status-form') && (e.submitter.value === 'Confirm')) {
                e.preventDefault();
                // THIS ONE! finally
                const chosenStatus = e.target.querySelector('[name="status"]').value;
                const chosenStatusText = e.target.querySelector(`[value="${chosenStatus}"]`).innerText;
                let currentCardId = e.target.closest('.card').dataset.id;
                const isId = (book) => book.id === currentCardId;
                library[library.findIndex(isId)].readValue = chosenStatus;
                library[library.findIndex(isId)].readStatus = chosenStatusText;
                let previousStatus = e.target.closest('.card').querySelector('.status').innerText.slice(0, 8);
                previousStatus += chosenStatusText;
                e.target.closest('.card').querySelector('.status').innerText = previousStatus;
                let parentDiv = e.target.closest('.change-status');
                parentDiv.firstChild.close();
            } else if (e.target.matches('.change-status-form') && (e.submitter.value === 'Cancel')) {
                e.preventDefault();
                let parentDiv = e.target.closest('.change-status');
                parentDiv.firstChild.close();
            }
        })


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
            library.push(tempBook)
            // let formBook = new BookForDisplay(tempBook)
            // formLibrary.push(formBook)
            this.displayLibrary(tempBook)
            bookDialog.close();
            bookForm.reset()
        })
    }

    createChangeButton(cardButtons) {
        let changeStatus = document.createElement('div');
        changeStatus.classList.add('change-status');
        let changeDialog = document.createElement('dialog');
        changeDialog.classList.add('change-dialog');
        let changeStatusForm = document.createElement('form');
        changeStatusForm.classList.add('change-status-form');
        let changeForm = document.createElement('div');
        changeForm.classList.add('change-form');
        let label = document.createElement('label');
        label.setAttribute('for', 'change-read');
        let select = document.createElement('select');
        select.setAttribute('name', 'status');
        select.setAttribute('id', 'change-read');
        select.appendChild(new Option('Not read', '0'));
        select.appendChild(new Option('Currently reading', '1'));
        select.appendChild(new Option('Read', '2'));
        //now create buttons for form
        let changeFormButtons = document.createElement('div')
        changeFormButtons.classList.add('change-form-buttons');
        let cancelButton = document.createElement('input');
        cancelButton.setAttribute('value', 'Cancel');
        cancelButton.setAttribute('type', 'submit');
        let confirmButton = document.createElement('input');
        confirmButton.setAttribute('value', 'Confirm');
        confirmButton.setAttribute('type', 'submit');
        changeFormButtons.appendChild(cancelButton);
        changeFormButtons.appendChild(confirmButton);


        changeStatus.appendChild(changeDialog);
        changeDialog.appendChild(changeStatusForm);
        changeStatusForm.appendChild(changeForm);
        changeForm.appendChild(label);
        changeForm.appendChild(select);
        changeStatusForm.appendChild(changeFormButtons);

        //creating button to access this dialog
        let changeButton = document.createElement('button');
        changeButton.classList.add('change-btn');
        changeButton.textContent = 'Change Status';
        //and now the struggle ends, append it to the changeStatus and then to the cardButtons div. voila!
        changeStatus.appendChild(changeButton);
        cardButtons.appendChild(changeStatus);
    }

    addButtons(card) {
    let cardBtns = document.createElement('div');
    cardBtns.classList.add('card-btns');
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete Book';
    cardBtns.appendChild(deleteBtn);
    this.createChangeButton(cardBtns);
    card.appendChild(cardBtns);
    }

    displayLibrary(lib) {
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
                } else if (j === valuesOfBook.length - 2) {
                    p.classList.add('status');
                    p.setAttribute('value', `${valuesOfBook[j][1]}`)
                    p.innerText = valuesOfBook[j][0];
                    card.appendChild(p)
                } else if (j === valuesOfBook.length - 1) {
                    card.setAttribute('data-id', valuesOfBook[j]);
                } else {
                    p.innerText = valuesOfBook[j];
                    card.appendChild(p)
                }
             }
            this.addButtons(card);
            this.cardholder.appendChild(card)
        }
    }
}


// LibraryDisplay.displayLibrary(formLibrary);
let libraryDisplayInstance = new LibraryDisplay();
libraryDisplayInstance.displayLibrary(library);