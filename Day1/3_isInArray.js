const isInArray = (items, item) => {
    for (let index = 0; index < items.length; index++) {
        if (items[index] === item) {
            return true;
        }
    }

    return false;
};
