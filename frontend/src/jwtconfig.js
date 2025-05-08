const config = (token) => {
    let config = {
        headers: {
            Authorization: 'Bearer ' + token
        },
        timeout: 5000
    }
    return config
};


export default config