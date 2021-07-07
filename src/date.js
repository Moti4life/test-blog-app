

let rightNow = () => {
    let date = new Date()
    let dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "2-digit"
    }
    let now = {
        date: date.toLocaleDateString('en', dateOptions),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return now
    
}



module.exports = {
    rightNow
}