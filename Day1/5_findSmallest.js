const findSmallest = (nums) => {
    let smallestNum = nums[0];
    for (let index = 1; index < nums.length; index++) {
        if (nums[index] < smallestNum) {
            smallestNum = nums[index];
        }
    }

    return smallestNum;
};
