const adviceNumber = document.querySelector('.advice__header-number');
const adviceContent = document.querySelector('.advice__content');
const adviceUnscrambled = adviceContent.querySelector('.advice__content-unscrambled');
const adviceScrambled = adviceContent.querySelector('.advice__content-scrambled');
const adviceButton = document.querySelector('.advice__button');
const buttonIcon = adviceButton.querySelector('.advice__button-icon');

displayAdvice();
adviceButton.addEventListener('click', displayAdvice);

async function displayAdvice() {
    setButtonToLoading();

    const advice = await getAdvice();

    adviceNumber.innerHTML = advice.id;
    scrambleText(advice.advice);
}

async function getAdvice() {
    const result = await fetch('https://api.adviceslip.com/advice');
    const json = await result.json();

    return json.slip;
}

function setButtonToLoading() {
    adviceButton.setAttribute('disabled', true);
    buttonIcon.setAttribute('src', '../images/blocks-wave.svg');
}

function setButtonToLoaded() {
    adviceButton.removeAttribute('disabled');
    buttonIcon.setAttribute('src', '../images/icon-dice.svg');
}

function prepareParagraph(newAdvice) {
    adviceUnscrambled.innerText = newAdvice;

    const initialHeight = adviceContent.offsetHeight;

    adviceContent.style['min-height'] = initialHeight + 'px';

    return initialHeight;
}

function resetParagraph() {
    adviceContent.style.height = 'auto';
    adviceContent.style['min-height'] = 'auto';
}

function updateParagraphHeight(newHeight) {
    adviceContent.style.height = newHeight + 'px';
}

function scrambleText(newAdvice) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase();
    const nonLettersOrWhitespace = /[\s.,!?;'"-]/;
    let interval = null;
    let iteration = 0;

    const initialHeight = prepareParagraph(newAdvice);
    let maximumHeight = initialHeight;
    
    clearInterval(interval);
    
    interval = setInterval(() => {
        adviceUnscrambled.innerText = newAdvice
            .split("")
            .map((_, index) => {
                if(index < iteration) {
                    return newAdvice[index];
                }
            
                return;
            })
            .join("");

        adviceScrambled.innerText = newAdvice
            .split("")
            .map((letter, index) => {
                if(maximumHeight < adviceContent.offsetHeight) {
                    updateParagraphHeight(adviceContent.offsetHeight);
                }

                if(index < iteration) {
                    return;
                }

                if(nonLettersOrWhitespace.test(letter)) {
                    return letter;
                }

                return letters[Math.floor(Math.random() * 26)]
            })
            .join("");
        
        if(iteration >= newAdvice.length){ 
            clearInterval(interval);
            resetParagraph();
            setButtonToLoaded();
        }
        
        iteration += 2;
    }, 20);
}