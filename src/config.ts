const firebaseConfig = {
    apiKey: "AIzaSyCLl1X9AlthJgGWaUAeRfoB_LrBQcn_lMY",
    authDomain: "chat-app-be5ab.firebaseapp.com",
    databaseURL: "https://chat-app-be5ab.firebaseio.com",
    projectId: "chat-app-be5ab",
    storageBucket: "chat-app-be5ab.appspot.com",
    messagingSenderId: "244377960279",
    appId: "1:244377960279:web:eaa8d0a8c1240fa5624812"
  }

const defaultChannel = "general"

const config = {
    ...firebaseConfig,
    defaultChannel,
}

export default config