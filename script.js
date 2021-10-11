
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDPmV4lV3b-NxEE2e5ERxsudgQvPzAB5SI",
      authDomain: "to-do-list-235e7.firebaseapp.com",
      projectId: "to-do-list-235e7",
      storageBucket: "to-do-list-235e7.appspot.com",
      messagingSenderId: "454010690316",
      appId: "1:454010690316:web:be652001c86dfdd048c729",
      measurementId: "G-EHML3MN8F5"
    };
  
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);
    var db=firebase.firestore();
        
    function addItems(event){
        event.preventDefault();
        console.log('hiii');
        let text = document.getElementById("todo-input");
        console.log(text.value);
        db.collection("todo-items").add({
            text: text.value,
            status: "active"
        })
        text.value = "";
    }
    var k=0;
    document.getElementById("additem").onsubmit=function(){addItems(event)};
    document.getElementById("button1").onclick=function(){newList1()};
    function newList1(){
        k=0;
        document.getElementById("all").className="active";
        document.getElementById("act").className="unactive";
        document.getElementById("com").className="unactive";
        getItems();
    }
    document.getElementById("button2").onclick=function(){newList2()};
    function newList2(){
        k=1;
        document.getElementById("all").className="unactive";
        document.getElementById("act").className="active";
        document.getElementById("com").className="unactive"; 
        getItems();
    }
    document.getElementById("button3").onclick=function(){newList3()};
    function newList3(){
        k=2;
        document.getElementById("all").className="unactive";
        document.getElementById("act").className="unactive";
        document.getElementById("com").className="active"; 
        getItems();
    }
    document.getElementById("button4").onclick=function(){clearAll()};
    function clearAll(){
        db.collection("todo-items").onSnapshot((snapshot) => {
            console.log(Object.keys(snapshot.docs).length);
            let n=Object.keys(snapshot.docs).length;
            console.log(n);
            for(let i=0;i<n;i++){
                console.log(snapshot.docs[i].data().text);
                if(snapshot.docs[i].data().status=="completed"){
                db.collection("todo-items").doc(snapshot.docs[i].id).delete();
                }

            }
            // var z=0;
            // let items = [];
            // snapshot.docs.forEach((doc1) => {
            //     console.log("Hello");
            //     if(doc1.data().status=='completed')
            //     {
            //         db.collection("todo-items").doc(doc1.id).delete();
            //         z=1;
            //         return;
            //     }
            // })
            }) 
        // db.collection("todo-items").doc.data().status("completed").delete();
    }

    function getItems(){
    db.collection("todo-items").onSnapshot((snapshot) => {
    console.log(snapshot);
    let items = [];
    snapshot.docs.forEach((doc) => {
        console.log(doc.data()); 
        if(k==1)
        {
            if(doc.data().status=="active")
            {
                items.push({
                    id: doc.id, 
                    ...doc.data()
                }) 
            }
        }
        else if(k==2){
            if(doc.data().status=='completed')
            {
                items.push({
                    id: doc.id,
                    ...doc.data()
                })
            }
        }
        else{
            items.push({
                id: doc.id, 
                ...doc.data()
            })
        }

    })
    generateItems(items);
    })
    }

function generateItems(items){
    let todoItems = []
    let l=0
    items.forEach((item) => {
        console.log(item.text)
        if(item.status=='active')
        l+=1;
        let todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        let checkContainer = document.createElement("div");
        checkContainer.classList.add("check");
        let checkMark = document.createElement("div");
        checkMark.classList.add("check-mark");
        checkMark.innerHTML = '<img src="assets/icon-check.svg">';
        checkMark.addEventListener("click", function(){
            markCompleted(item.id);
        })
        checkContainer.appendChild(checkMark);

        let todoText = document.createElement("div");
        todoText.classList.add("todo-text");
        todoText.innerText = item.text;

        if(item.status == "completed"){
            checkMark.classList.add("checked");
            todoText.classList.add("checked");
        }
        todoItem.appendChild(checkContainer);
        todoItem.appendChild(todoText);
        todoItems.push(todoItem)
    })
    var str="<span>";
    str+=String(l);
    str+=" Items Left";
    str+="</span>";
    document.getElementById("remaining-tasks").innerHTML=str;
    document.querySelector(".todo-items").replaceChildren(...todoItems);
}



// function addItems(){
//     console.log('hiii')
//     let text = document.getElementById("todo-input");
//     console.log(text);
//     let newItem = db.collection("todo-items").add({
//         text: text.value,
//         status: "active"
//     })
//     text.value = "";
// }

function markCompleted(id){
    let item = db.collection("todo-items").doc(id);
    item.get().then(function(doc) {
        if (doc.exists) {
            if(doc.data().status == "active"){
                item.update({
                    status: "completed"
                })
            } else {
                item.update({
                    status: "active"
                })
            }
        }
    })
}

getItems();
