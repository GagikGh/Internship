
const cards = document.getElementById("cards");

const idsArr = ["mountain", "river", "lake", "woods", 'church', "city", "elephant", "lion", "giraffe", "tiger", "wolf", "bear", "dog", "cat", "aigle"];

const buttons = document.querySelectorAll(".variant");
let choseArray = null;
let width = null;
let height = null;
buttons.forEach(btn =>{
    btn.addEventListener("click", (e) => {
        width = e.target.dataset.width ;
        height = e.target.dataset.height ;
        console.log(width, height);
        cards.style['grid-template-columns'] = `repeat(${width},auto)`;

        choseArray = idsArr.slice(0, parseInt(width) * parseInt(height) / 2);
        cards.innerHTML = ""

        handleGame(generateArr(choseArray))
        console.log(choseArray);
        document.querySelector(".reset-btn").remove()

    })
})



const randomNumber = (length) => Math.floor(Math.random() * length)

function  checkDoubles (set, length){
    const num = randomNumber(length) ;
    set.add(num)

    if (set.size === length) {
        return set;
    } else {
        return checkDoubles(set, length);
    }

}

function generateArr(idsArr) {
    const newArray = []
    let set = new Set()

    set = [...checkDoubles(set, idsArr.length * 2)];
    let currentIndex = 0;
    for (const id of idsArr) {
        for (let index = 0; index < 2; index++) {
            newArray[set[currentIndex]] = {
                image: `assets/${id}.jpg`,
                id
            }
            currentIndex++
        }
    }

    return newArray;
}

let firstOpen = null;
let secondOpen = null;
let block = false;
let count = 0;
let matchedCards = [];


const handleGame = (data) => {
    cards.classList.remove("hidden");
    data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "bg-white w-50 aspect-square rounded shadow cursor-pointer overflow-hidden ";
        const img = document.createElement("img");
        img.className = " w-full h-full object-cover hidden";
        img.src = item.image;
        img.dataset.id = item.id;
        const back = document.createElement("div");
        back.className = "w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold";

        card.appendChild(img);
        card.appendChild(back);
        cards.appendChild(card);

        function renderCards(arr) {
            block = false;
            firstOpen = null;
            secondOpen = null;
            arr.forEach((item) => {
                item.removeEventListener("click", handleGame);
            })
        }

        function handleCards () {
            if(block  || img.classList.contains("matched")) return;

            back.classList.add("hidden");
            img.classList.remove("hidden");

            if (!firstOpen) {
                firstOpen = img;
            } else {
                secondOpen = img;
                block = true;

                if (firstOpen.dataset.id !== secondOpen.dataset.id) {
                    setTimeout(() => {
                        firstOpen.classList.add("hidden");
                        secondOpen.classList.add("hidden");
                        firstOpen.parentElement.lastElementChild.classList.remove("hidden");
                        secondOpen.parentElement.lastElementChild.classList.remove("hidden");
                        renderCards(matchedCards);
                    },400)
                } else {
                    count++
                    firstOpen.classList.add("matched");
                    secondOpen.classList.add("matched");
                    matchedCards.push(firstOpen);
                    matchedCards.push(secondOpen);
                    renderCards(matchedCards);
                    console.log(count)

                    if (count === width * height / 2) {
                        alert("You win")
                        handleResetGame()
                        count = 0
                    }
                }
            }


        }

        card.addEventListener("click",  handleCards)

    })


}

function handleResetGame() {
    const resetGameButton = document.createElement("button");
    resetGameButton.textContent = "Reset Game";
    resetGameButton.className = "px-4 p-3 bg-blue-600 text-white text-2xl font-bold reset-btn";
    document.body.appendChild(resetGameButton);

    resetGameButton.addEventListener("click", () => {
        cards.innerHTML = "";
        handleGame(generateArr(choseArray))

    });

}






