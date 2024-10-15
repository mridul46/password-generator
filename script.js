const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateButton");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password= "";
let passwordLength=10;
let checkCount=1;
uppercaseCheck.checked = true;
setIndicator("#ccc");
handleSlider();


//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
      ((passwordLength - min) * 100) / (max - min) + "% 100%";
  }

function setIndicator(color){
    indicator.style.backgroundColor= color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function shufflePasword(array){
    //fisher Yates.method  
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

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;

}  
function generateRandomNumber(){
    return getRndInteger(0,9);
}    
function generateLoweCase(){
    return String.fromCharCode(getRndInteger(97,123));

}  
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}    
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}



function calculateStrength() {
    let isNumber = false;
    let isUpper = false;
    let isLower = false;
    let isSymbol = false;


    // checking whether checkboxes are ticked or not
    if (numbersCheck.checked) isNumber = true;
    if (uppercaseCheck.checked) isUpper = true;
    if (lowercaseCheck.checked) isLower = true;
    if (symbolsCheck.checked) isSymbol = true;

    // setting strong password
    if (isNumber && isUpper && (isSymbol || isLower) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((isLower || isUpper) && (isNumber || isSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(error){
        copyMsg.innerText="Failed";
    }
    //to make copy wala spain visiable
    copyMsg.classList.add("active");
    setTimeout( ()=> {
        copyMsg.classList.remove("active");
    },2000);
}


inputSlider.addEventListener('input', (e) => {
    passwordLength= e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>  {
       if(checkbox.checked)
       checkCount++; 
    });
    //special Condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})


 generateBtn.addEventListener('click',()=>{
    //none of the check box are the selected 
    if (checkCount <= 0) {
        alert("please select at least one checkbox");
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //lets start the jouney to find new password
    //remove old password
    if (password.length) password = "";
    //let's put the mention by checkbox
    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked)
        funcArr.push(generateLoweCase);
    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);
     if (symbolsCheck.checked)
        funcArr.push(generateSymbol);
      

        //compulory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
  
        //remaing addition
        for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
  
    //shuffle the password
    password += shufflePasword(Array.from(password));
   
    //show in UI
    passwordDisplay.value=password;
    
    //calculate strength
    calculateStrength();
   
         
});
