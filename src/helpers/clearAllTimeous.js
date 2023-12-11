const clearAllTimeouts = (...timeouts) => {
    timeouts.forEach((timeout) => {
        clearTimeout(timeout);
    });
};
export default clearAllTimeouts;