const leftPad = (s, n) => {
    let result = s + "";

    while(result.length < n) {
        result = "0" + result;
    }

    return result
};

export default leftPad;
