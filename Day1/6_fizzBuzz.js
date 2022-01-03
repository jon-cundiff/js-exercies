const fizzBuzz = (num) => {
    let text = "";
    if (num % 3 === 0) {
        text += "Fizz";
    }

    if (num % 5 === 0) {
        text += "Buzz";
    }

    return text ? text : num;
};

for (let n = 0; n <= 30; n++) {
    console.log(fizzBuzz(n));
}
