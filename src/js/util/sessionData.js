
// Utilities for managing session state

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        let cachedData = sessionStorage.getItem('currentUser');

        if(cachedData) {
            return resolve(JSON.parse(cachedData));
        }

        fetch("/v1/profile").then(response => {
            return response.json();
        }).then(data => {
            sessionStorage.setItem('currentUser', JSON.stringify(data));
            resolve(data);
        }).catch(reject);
    });
};

// TODO: Store in localStorage, load into <App>'s state, propagate with a Provider

export { getCurrentUser };
