let socket;

class Widget {
  constructor({ position = "bottom-right" }) {
    this.position = this.getPosition(position);
    this.open = false;
    this.initialise();
    this.createStyles();
    this.checkForMessages();
    this.previousMessages = []
    setTimeout(()=>{
        this.connectsocket()
    },2000)
  }

  getPosition(position) {
    const [vertical, horizontal] = position.split("-");
    return {
      [vertical]: "30px",
      [horizontal]: "30px",
    };
  }

  // loadIframe() {
  //   const iframe = document.createElement("iframe");
  //   iframe.id = "iframe123";

  //   const iframeStyle = iframe.style;
  //   iframeStyle.boxSizing = "borderBox";
  //   iframeStyle.position = "absolute";
  //   iframeStyle.right = 0;
  //   iframeStyle.top = 0;
  //   iframeStyle.width = "100%";
  //   iframeStyle.height = "100%";
  //   iframeStyle.border = 0;
  //   iframeStyle.margin = 0;
  //   iframeStyle.padding = 0;
  //   iframeStyle.width = "500px";

  //   document.body.appendChild(iframe);

  //   iframe.addEventListener("load", () => {
  //     this.loadIframe();
  //     this.createStyles();
  //   });
  //   iframe.srcdoc = "<script>this.loadIframe();this.createStyles()</script>";
  // }

  initialise() {
    const socketScript = document.createElement('script');
    socketScript.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.js');
    document.head.append(socketScript);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    document.head.appendChild(link)
    const container = document.createElement("div");
    container.style.position = "fixed";
    Object.keys(this.position).forEach(
      (key) => (container.style[key] = this.position[key])
    );
    document.body.appendChild(container);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const chatIcon = document.createElement("div");
    //chatIcon.src = "chat.png";
    chatIcon.innerHTML = "&#128172;";
    chatIcon.classList.add("icon");
    this.chatIcon = chatIcon;

    const closeIcon = document.createElement("div");
    //closeIcon.src = "assets/cross.svg";
    closeIcon.innerHTML = "X";
    closeIcon.classList.add("icon", "hidden");
    this.closeIcon = closeIcon;

    buttonContainer.appendChild(this.chatIcon);
    buttonContainer.appendChild(this.closeIcon);
    buttonContainer.addEventListener("click", this.toggleOpen.bind(this));

    this.messageContainer = document.createElement("div");
    this.messageContainer.classList.add("hidden", "message-container");
    this.createMessageContainerContent();
    container.appendChild(this.messageContainer);
    container.appendChild(buttonContainer);
    // document
    //   .querySelector("#emailSubmit")
    //   .addEventListener("click", this.emailSubmit.bind(this));
  }

  createMessageContainerContent() {
    this.messageContainer.innerHTML = "";
    const profile = document.createElement("div");
    profile.classList.add("profile");
    profile.innerHTML = `  <div style="width:60px;height:60px;border:1px solid grey;border-radius:50%"></div>
    <h4 style='margin:5px'>John Doe</h4>
    <p style="margin:0">Customer Support</p>`;
    const title = document.createElement("h2");
    title.textContent = `Chat With Our Agent`;

    const messages = document.createElement("div");
    messages.id = "messages";
    messages.style.height = "300px";
    messages.style.overflowY = "scroll";
    messages.style.padding = "10px";
    messages.style.background = "white";
    // messages.innerHTML = `<div id='emailForm' style="padding:70px 40px">
    // <input placeholder='UserName' id='userName' type='text' required style='margin-bottom:10px;width:90%;padding:10px' />
    // <input placeholder='Email' id='email' type='email' required style='margin-bottom:15px;width:90%;padding:10px' />
    // <button type='submit' id='emailSubmit' class='emailBtn' > Start Chatting  </button>
    // </div>`;

    const form = document.createElement("form");
    form.classList.add("content");
    //form.style.display = "none";
    const chatInput = document.createElement("input");
    chatInput.style.width = "90%";
    chatInput.style.height = "45px";
    chatInput.required = true;
    chatInput.id = "chatInput";
    chatInput.type = "text";
    chatInput.placeholder = "Type your message";

    const btn = document.createElement("button");
    btn.type = "submit";
    btn.style.width = "40px";
    btn.innerHTML = `<i class="fa fa-send-o" />`;
    form.appendChild(chatInput);
    form.appendChild(btn);
    form.addEventListener("submit", this.submit.bind(this));

    this.messageContainer.appendChild(profile);
    this.messageContainer.appendChild(messages);
    this.messageContainer.appendChild(form);
  }

  createStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
            .emailBtn{
              cursor: pointer;
              background-color: #04b73f;
              color: #fff;
              border: 0;
              border-radius: 4px;
              padding: 10px;
            }
            .icon {      
                cursor: pointer;
                width: 70%;
                position: absolute;
                top: 12px;
                left: 9px;
                transition: transform .3s ease;
            }
            .hidden {
                transform: scale(0);
            } 
            .button-container {
                background-color: #04b73f;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                font-size:30px;
                text-align:center;
                color:black;
            }
            .profile {
                display:flex;
                flex-direction:column;
                align-items:center;
                padding:5px;
                border-bottom: 1px solid grey;
                background:darkslategrey;
                color:white;
            }
            .message-container {
                box-shadow: 0 0 18px 8px rgba(0, 0, 0, 0.1), 0 0 32px 32px rgba(0, 0, 0, 0.08);
                width: 400px;
                right: 25px;
                bottom: 75px;
                position: absolute;
                transition: max-height .2s ease;
                font-family: Helvetica, Arial ,sans-serif;
            }
            .message-container.hidden {
                max-height: 0px;
            }
            .message-container h2 {
                margin: 0;
                padding: 20px 20px;
                color: #fff;
                background-color: #04b73f;
            }
            .message-container .content {
                padding: 10px;
                display: flex;
                background-color: #fff;
            }
            .message-container form * {
                margin: 5px 5px 5px 0;
            }
            .message-container form input {
                padding: 10px;
            }
            .message-container form textarea {
                height: 100px;
                padding: 10px;
            }
            .message-container form textarea::placeholder {
                font-family: Helvetica, Arial ,sans-serif;
            }
            .message-container form button {
                cursor: pointer;
                background-color: #04b73f;
                color: #fff;
                border: 0;
                border-radius: 4px;
                padding: 10px;
            }
            .message-container form button:hover {
                background-color: #16632f;
            }
        `.replace(/^\s+|\n/gm, "");
    document.head.appendChild(styleTag);
  }

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      this.chatIcon.classList.add("hidden");
      this.closeIcon.classList.remove("hidden");
      this.messageContainer.classList.remove("hidden");
    } else {
      //this.createMessageContainerContent();
      this.chatIcon.classList.remove("hidden");
      this.closeIcon.classList.add("hidden");
      this.messageContainer.classList.add("hidden");
    }
  }

  emailSubmit() {
    const userName = document.querySelector("#userName").value;
    const email = document.querySelector("#email").value;
    if (userName.trim() && email.trim()) {
      document.querySelector("#emailForm").style.display = "none";
      document.querySelector("form").style.display = "block";
    }
  }

  submit(event) {
    event.preventDefault();
    console.log("event", event.srcElement);

    document.querySelector(
      "#messages"
    ).innerHTML += `<div style="padding:10px;width: fit-content;
    margin-left: auto;margin-bottom:5px;font-size:17px;
    border-radius: 4px;background:black;color:white">${
      event.srcElement.querySelector("#chatInput").value
    } <span style="font-size:11px">${getTime()}  </span><span style='font-size:11px;margin-left:5px'>&#x2713;&#x2713;</span></div>`;

    sendMessageToServer(event.srcElement.querySelector("#chatInput").value);

    event.srcElement.querySelector("#chatInput").value = "";
    // auto scroll
    const el = document.getElementById("messages");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  connectsocket() {
    // Create SocketIO instance, connect
    socket = new io("http://54.208.9.159:5000");
    // Add a connect listener
    socket.on("connect", function () {
      console.log("Widget has connected to the server!");
    });
    // Add a chat listener
    socket.on("agent-response", function (data) {
      console.log("Received a message from the agent!", data);
      document.querySelector(
      "#messages"
    ).innerHTML += `<div style="padding:10px;width: fit-content;
    margin-right: auto;margin-bottom:5px;font-size:17px;
    border-radius: 4px;background:skyblue;color:white">${
      data.bodyText
    } <span style="font-size:11px">${getTime()}  </span><span style='font-size:11px;margin-left:5px'>&#x2713;&#x2713;</span></div>`;
    });
    // Add a disconnect listener
    socket.on("disconnect", function () {
      console.log("The widget has disconnected!");
    });
  }

  async checkForMessages() {
    await fetch('http://54.208.9.159:5000/chat/visitor-conversation',{
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      pluginId: "65133396e05f832e9576aade",
      domain: "1415inc.com",
      visitorId: "651747d12cb44bc4e54eccff",
      guestId: 14
    })
  }).then(res=>res.json()).then(res=>{
    console.log('chat',res.conversation)
    this.previousMessages = [...res.conversation]
    res?.conversation?.map((message)=>{
      if(message.direction==='inbound'){
        document.querySelector(
      "#messages"
    ).innerHTML += `<div style="padding:10px;width: fit-content;
    margin-left: auto;margin-bottom:5px;font-size:17px;
    border-radius: 4px;background:black;color:white">${
      message.bodyText
    } <span style="font-size:11px">${message?.chatTime.substring(11,16)  ||getTime()}  </span><span style='font-size:11px;margin-left:5px'>&#x2713;&#x2713;</span></div>`;
      }
      else{
        document.querySelector(
      "#messages"
    ).innerHTML += `<div style="padding:10px;width: fit-content;
    margin-right: auto;margin-bottom:5px;font-size:17px;
    border-radius: 4px;background:skyblue;color:white">${
      message.bodyText
    } <span style="font-size:11px">${message?.chatTime.substring(11,16)  || getTime()}  </span><span style='font-size:11px;margin-left:5px'>&#x2713;&#x2713;</span></div>`;
      }
    })
  }).catch(error=>{console.log('error',error)})
  }
}

function sendMessageToServer(message) {
  //socket.emit("chat", message);
  fetch('http://54.208.9.159:5000/chat/receive-a-message',{
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      visitorId:'651747d12cb44bc4e54eccff',
      guestId:'14',
      agentId:'650362cc59e62b6a56d3eb1b',
      agentName:'Agent One',
      bodyText:message
    })
  })
}

function getTime() {
  let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();

    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;

    let time = hh + ":" + mm;
    return time
}

// setTimeout(()=>{
//     new Widget({position:'bottom-right'})
// },5000)
window.onload =  new Widget({position:'bottom-right'})