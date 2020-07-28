const socket = io()

//elements
const $messageForm = document.getElementById('chat-form')
const $messageInput = document.getElementById('message-input')
const $messageBtn = document.getElementById('send-btn')
const $sendLocationBtn = document.getElementById('send-location-btn')
const $messages = document.getElementById('messages')

//template
const msgTemplate = document.getElementById('message-template').innerHTML
const locationTpl = document.getElementById('location-template').innerHTML
const sidebarTpl = document.getElementById('sidebar-template').innerHTML

//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoScroll = () =>{
    const $newMessage = $messages.lastElementChild
    console.log(document.querySelector("#messages"))
    if($newMessage){
        const newMsgStyles = getComputedStyle($newMessage)
        const newMsgMargin = parseInt(newMsgStyles.marginBottom)
        const newMsgHeight = $newMessage.offsetHeight + newMsgMargin
    
        const visibleHeight = $messages.offsetHeight
        const containerHeight = $messages.scrollHeight
    
        const scrollOffset = $messages.scrollTop + visibleHeight
    
        if(containerHeight - newMsgHeight <= scrollOffset){
            $messages.scrollTop = $messages.scrollHeight
        }
    }

}

//text message
socket.on('message', (message)=>{
    const html = Mustache.render(msgTemplate, {
        username:message.username,
        text:message.text,
        createdAt: moment(message.createdAt).format('hh:mm:ss')
    })
    $messages.insertAdjacentHTML('beforebegin',html)
    autoScroll()
})



//location message
socket.on('locationMessage', (message)=>{
    const html = Mustache.render(locationTpl, {
        username:message.username,
        url:message.url,
        createdAt:  moment(message.createdAt).format('hh:mm:ss')
    })
    $messages.insertAdjacentHTML('beforebegin', html)
    autoScroll()
})

//reload room users
socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTpl,{
        room,
        users
    })
    document.getElementById('sidebar').innerHTML = html
})

$messageBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    if(!$messageInput.value){
        return alert('Please input your message!')
    }
    $messageBtn.setAttribute('disabled', 'disabled')
    socket.emit('sendMessage', $messageInput.value, (error)=>{
        $messageBtn.removeAttribute('disabled')
        if(error){
            return console.log(error)
        }
        console.log('message sent!')
        $messageInput.value =''
        $messageForm.focus()
        
    })
    
})

$sendLocationBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    if("geolocation" in navigator){
         navigator.geolocation.getCurrentPosition((location)=>{     
            $sendLocationBtn.setAttribute('disabled', 'disabled')
             socket.emit('sendLocation',{
                 latitude:location.coords.latitude,
                 longtitude:location.coords.longitude
             },(error)=>{
                 if(error){
                    return console.log('Something went wrong!')
                 }
                 console.log('location shared!')
                 $sendLocationBtn.removeAttribute('disabled')
             })
         })
    }else{
        return alert('GeoLocation not supported!')
    }
    
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href= '/'
    }
})