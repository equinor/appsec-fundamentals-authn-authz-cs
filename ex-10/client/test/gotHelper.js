let gotInstance;

async function getGot() {
    if (!gotInstance) {
        const got = await import('got');
        gotInstance = got.default;
    }
    return gotInstance;
}

// For testing purposes: Allow resetting gotInstance
function resetGot() {
    gotInstance = null;
}

module.exports = { getGot, resetGot };
