const removeDuplicates = (items) => {
    const uniqueItems = [];
    items.forEach((item) => {
        if (!uniqueItems.includes(item)) {
            uniqueItems.push(item);
        }
    });

    return uniqueItems;
};
