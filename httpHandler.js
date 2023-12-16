import { toObjs } from "./persona.js"

export class HttpHandler {
    constructor() {
        if (!this.XMLHttpRequest) {
            this.XMLHttpRequest = new XMLHttpRequest();
            this.XMLHttpRequest.addEventListener("progress", updateProgress);
            this.XMLHttpRequest.addEventListener("load", transferComplete);
            this.XMLHttpRequest.addEventListener("error", transferFailed);
            this.XMLHttpRequest.addEventListener("abort", transferCanceled);
        }
    }

    sendGetSync() {
        this.XMLHttpRequest.open("GET", GetUrl(), false);
        this.XMLHttpRequest.send();
        if (this.XMLHttpRequest.status === 200) {
            const jsonString = this.XMLHttpRequest.responseText;
            const jsonArray = JSON.parse(jsonString);
            const entidades = toObjs(jsonArray);
            return entidades;
        }
        else {
            console.log("error on sending request to the server: " + this.XMLHttpRequest.status);
        }
    }

    sendPutAsync(obj) {
        return new Promise((resolve, reject) =>{
            fetch(GetUrl(), {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(obj)
            }).then(response => {
                if(response.ok){
                    resolve(response);
                }else{
                    response.text().then(errorMessage => {
                        reject(new Error('Error ' + response.status + ': ' + errorMessage));
                    });
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    async sendPostAsync(obj){
        const response = await fetch(GetUrl(), {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(obj)
        });    
        if (!response.ok) {
            alert(`Error HTTP: ${response.status}`);
        }    
        return response;
    }
    async sendDeleteAsync(obj){
        try {
            const response = await fetch(GetUrl(), {
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(obj)
            });    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }    
            return response;
        } catch (error) {
            console.error(`Fetch failed: ${error.message}`);
            return new Response(error.message, { status: error.status ? error.status : 500, statusText: "Internal Server Error" });
        }
    }

}
function GetUrl() {
    return "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero";
}
function updateProgress(event) {
    if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log("Compute progress: " + percentComplete);
    } else {
        // Unable to compute progress information since the total size is unknown
        console.log("Unable to compute progress information since the total size is unknown");
    }
}
function transferComplete(evt) {
    console.log("The transfer is complete.");
}

function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
}

function transferCanceled(evt) {
    console.log("The transfer has been canceled by the user.");
}