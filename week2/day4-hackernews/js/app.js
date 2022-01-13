const storiesList = document.getElementById("storiesList");

const baseURL = "https://hacker-news.firebaseio.com/v0";

const getTopStories = async () => {
    const response = await fetch(`${baseURL}/topstories.json`);
    const storiesIds = await response.json();
    return storiesIds;
};

const getStoriesDetails = async (storiesIds) => {
    const requests = storiesIds.map((storyId) =>
        fetch(`${baseURL}/item/${storyId}.json`)
    );

    const storiesResponses = await Promise.all(requests);
    const storiesPromises = await storiesResponses.map((storyResponse) =>
        storyResponse.json()
    );

    const storiesDetails = await Promise.all(storiesPromises);
    return storiesDetails;
};

const displayStoriesDetails = (storiesDetails) => {
    const storyDetailItems = storiesDetails.map((storyDetails) => {
        // storyDetails returns seconds since epoch, Date constructor uses milliseconds
        const storyDate = new Date(storyDetails.time * 1000).toLocaleString();
        return `<li>
            <b><a href="${storyDetails.url}">${storyDetails.title}</a></b> <i>by ${storyDetails.by}</i> on ${storyDate}
        </li>`;
    });

    storiesList.innerHTML = storyDetailItems.join("");
};

const displayError = () => {
    storiesList.innerHTML = `
        <li>There was an error retrieving the top stories.</li>
    `;
};

getTopStories()
    .then(async (storiesIds) => {
        const storiesDetails = await getStoriesDetails(storiesIds);
        displayStoriesDetails(storiesDetails);
    })
    .catch(() => {
        displayError();
    });
