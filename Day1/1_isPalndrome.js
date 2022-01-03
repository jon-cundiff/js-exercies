const isPalindome = (word) => {
    let reversedWord = "";
    for (let index = word.length - 1; index >= 0; index--) {
        reversedWord += word[index];
    }

    return word === reversedWord;
};

console.log(isPalindome("tacocat") ? "PALINDROME" : "NOT A PALINDROME");
