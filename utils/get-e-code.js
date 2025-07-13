const generateEmpCode = async (firstName) => {
    const currentTimestamp = new Date().getTime();
    return `E${firstName.charAt(0)}00${currentTimestamp}`;
}

module.exports = generateEmpCode;