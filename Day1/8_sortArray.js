// insertion sort
const sortAscending = (nums) => {
    for (let i = 1; i < nums.length; i++) {
        if (nums[i - 1] > nums[i]) {
            for (let j = i; j > 0; j--) {
                if (nums[j - 1] < nums[j]) {
                    break;
                } else {
                    temp = nums[j];
                    nums[j] = nums[j - 1];
                    nums[j - 1] = temp;
                }
            }
        }
    }
};

const sortDescending = (nums) => {
    for (let i = 1; i < nums.length; i++) {
        if (nums[i - 1] < nums[i]) {
            for (let j = i; j > 0; j--) {
                if (nums[j - 1] > nums[j]) {
                    break;
                } else {
                    temp = nums[j];
                    nums[j] = nums[j - 1];
                    nums[j - 1] = temp;
                }
            }
        }
    }
};

const ascendedNums = [3, 4, 56, 7, 8, 1];
const descendedNums = [3, 4, 56, 7, 8, 1];

sortAscending(ascendedNums);
sortDescending(descendedNums);

console.log(ascendedNums);
console.log(descendedNums);
