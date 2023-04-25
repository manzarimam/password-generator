const inputSlider = document.querySelector("[passwordSlider]");
const passLen = document.querySelector("[passwordLength]");
const displayPass = document.querySelector("[displayPassword]");
const copyPass = document.querySelector("[copyMsg]");
const copyBtn = document.querySelector("[copyButton]");
const uppercaseChk = document.querySelector("#uppercase");
const lowercaseChk = document.querySelector("#lowercase");
const numberChk = document.querySelector("#numbers");
const symbolChk = document.querySelector("#symbols");
const passIndicator = document.querySelector("[passStrengthIndicator]");
const generateBtn = document.querySelector("#generatePassword");
const clearBtn = document.querySelector(".clearPassword");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const checks = document.querySelectorAll(".check");
const weak = document.querySelector(".weak");
const strong = document.querySelector(".strong");
const medium = document.querySelector(".medium");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// console.log(allCheckbox);

// set all default value's first 
let password = "";
let passLength = 0;
let chckboxCount = 0;
handleSlider();
// password strength div is of color grey white.

setIndicator("#ccc");
// let's handle slider - set's value 
function handleSlider() {
    inputSlider.value = passLength;
    passLen.innerText = passLength;


    // formula to set the background color of slider, which part to show violet and which part black
    const min = inputSlider.min
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passLength - min) * 100 / (max - min)) + "% 100%";
}

// setting color
function setIndicator(color) {

    if (color == "#f00") {
        weak.classList.add("activeWeak");

        setTimeout(() => {
            weak.classList.remove("activeWeak");
        }, 2000);
    } else if (color == "#0f0") {
        strong.classList.add("activeStrong");
        setTimeout(() => {
            strong.classList.remove("activeStrong");
        }, 2000);
    } else if (color == "#ff0") {
        medium.classList.add("activeMedium");
        setTimeout(() => {
            medium.classList.remove("activeMedium");
        }, 2000);
    }

    passIndicator.style.backgroundColor = color;
    // shadow
    passIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    /* ramdom() generates number in between 0 to 1, so we multiply it with (max-min) so your no. will come in between 0 to (max-min)
    
        now you want your number in between min and max, so you add min to it..

        i.e. Math.random() * (max-min) + min;

        this might return float value, so use Math.floor
    */
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0, 9);
    // this will give random no. in between 0 to 9
}

function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
    /* these are char's so, convert integer to character */
}

function generateUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

// we hardcored all symbols in a constant, and from the index we will access any random symbol
function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}



function calculateStrength() {
    let isNumber = false;
    let isUpper = false;
    let isLower = false;
    let isSymbol = false;


    // checking whether checkboxes are ticked or not
    if (numberChk.checked) isNumber = true;
    if (uppercaseChk.checked) isUpper = true;
    if (lowercaseChk.checked) isLower = true;
    if (symbolChk.checked) isSymbol = true;

    // setting strong password
    if (isNumber && isUpper && (isSymbol || isLower) && passLength >= 8) {
        setIndicator("#0f0");
    } else if ((isLower || isUpper) && (isNumber || isSymbol) && passLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// copying to clipboard

async function copyMessage() {
    // there might be some error in async code, so write this in try catch block

    try {
        await navigator.clipboard.writeText(displayPass.value);
        // if successfully copied, then show the copied message
        copyPass.innerText = "copied!!"

    } catch (error) {
        copyPass.innerText = "Failed!!";
    }

    // to make copied visible, we add css
    copyPass.classList.add("active");

    // will remove the class after 2 seconds
    setTimeout(() => {
        copyPass.classList.remove("active");
    }, 2000);
}

// #️⃣ it's time add an event lister on slider, when you slide the slider, then your value will increase or decrease.. 

// scrolling the slider is an input for slider
inputSlider.addEventListener('input', (e) => {
    passLength = e.target.value;
    handleSlider();
})


// #️⃣ adding event listener on copy button
copyBtn.addEventListener('click', () => {
    // if the input field is not empty then only we call copyMsg function
    if (displayPass.value) {
        copyMessage();
    }
})

function handleCheckboxChange() {
    chckboxCount = 0;
    // if any one of checkbox is changed, then we calculate all the checkboxes again from 0
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            chckboxCount++;
        }
    });

    // special case - let say, pass length is 1, and 4 boxes are selected, then in that case, you will update pass length to current checkbox count
    if (passLength < chckboxCount) {
        passLength = chckboxCount;
        handleSlider();
    }
    // whenever you update pass length call handleSlider()
}

// #️⃣ adding event listener on each checkbox
allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})



function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// 🔥 Generate password 
// add event listener to this..

generateBtn.addEventListener('click', () => {
    // if not any checkbox is checked then no password is generated.. so add event listener to checkboxes, and count them

    // case 1
    if (chckboxCount == 0) {
        alert("please select at least one checkbox");
        return;
    }


    // case 2
    if (passLength < chckboxCount) {
        passLength = chckboxCount;
        handleSlider();
    }

    // creating a new password

    // first, make old password empty
    password = ""

    // now store all the function in an array, so that we can call array index, and that function

    let functionArray = [];

    if (uppercaseChk.checked)
        functionArray.push(generateUppercase);
    if (lowercaseChk.checked)
        functionArray.push(generateLowercase);
    if (symbolChk.checked)
        functionArray.push(generateSymbol);
    if (numberChk.checked)
        functionArray.push(getRandomNumber);


    // when 4 checkboxes are checked, then add 4 length password, which is compulsory..

    for (let index = 0; index < functionArray.length; index++) {
        password += functionArray[index]();
        // calling function
    }


    // now if length is 10, n you have added 4 length password, so add remaining passwords
    for (let i = 0; i < passLength - functionArray.length; i++) {
        let randomIndex = getRandomInteger(0, functionArray.length);
        console.log("get random index");
        password += functionArray[randomIndex]();
    }

    password = shufflePassword(Array.from(password));
    console.log("password shufflled")
    displayPass.value = password;


    calculateStrength();
})


clearBtn.addEventListener('click', () => {

    // displayPass.value = "";
    // passLength = 4;
    // handleSlider();
    // setIndicator("#fff");
    window.location.reload();
    passLength = 4;
})