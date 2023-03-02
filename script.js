const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelector("input[type=checkbox]");
const symbol = '`~@#$%^&*()_-+{}|[]\;<>?:",./' ;


//initially
let password = "";
let passwordlength = 10;
let checkCount =0;
handleSlider();

//set stregth cicle
setIndicator("#ccc");


//set password length
function handleSlider(){
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength - min)*100/(max - min)) + "% 100%"

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px {$color}`;
}

function getRndInterger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInterger(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInterger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInterger(65, 91));
}

function generateSymbol(){
    const randNum = getRndInterger(0, symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hassym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNumber = true;
    if (symbolCheck.checked) hassym = true;

    if (hasUpper && hasLower && (hasNumber || hassym)&& passwordlength >=8){
        setIndicator("#0f0");

    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hassym) &&
        passwordlength >=6

    ){
        setIndicator("#ff0");
    }   else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    //make copy span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    //Fisher yates method
    for (let i=Array.length -1; i >0; i--){

        //random j
        const j = math.floor(math.random() * (i+1));

        //swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    if (passwordlength < checkCount){
        passwordlength = checkCount;
        handleSlider();
    }
}



allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

generatebtn.addEventListener('click', () => {
    //none of the boxes selected
    if(checkCount==0) 
    return;

    if(passwordlength < checkCount){
        passwordlength = checkCount;
        handleSlider();
    }

    //new password generation
    console.log("starting the journey");


    //remove old password
    password ="";


    //stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for(let i =0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("compulsory addition done");

    //remaining addition
    for(let i =0; i< passwordlength-funcArr.length; i++){
        let randIndex = getRndInterger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }

    console.log("Remaining Addition Done")

    //shuffle the password
    password = shufflePassword(array.from(password));
    console.log("shuffling done");

    //show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    //calculate strength
    calcStrength();
});
