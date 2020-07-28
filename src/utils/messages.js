const generateMessage = (username, text) =>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
   
}

const generateLocationMessage = (username, location) => {
    return {
        username,
        url: `https://google.com/maps?q=${location.latitude},${location.latitude}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage: generateMessage,
    generateLocationMessage: generateLocationMessage
}