const findLargest = (nums) => {
    let largest = nums[0];
    for (let index = 1; index < nums.length; index++) {
        if (nums[index] > largest) {
            largest = nums[index];
        }
    }

    return largest;
};
