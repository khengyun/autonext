var TOKEN = ""
var PORT = 8443;
var USER_INFOR = {};
var USER_SUBJECTS = [];
var USER_CLASS = [];
var USER_COURSE = [];

function post_api(input_get_data) {
  return new Promise((resolve, reject) => {
    const url = input_get_data.url;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${TOKEN}`,
      },
      body: input_get_data.body ? JSON.stringify(input_get_data.body) : null,
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        reject(error);
      });
  });
}



function get_api(input_get_data) {
  return new Promise((resolve, reject) => {
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${TOKEN}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(input_get_data.url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error when load ${input_get_data.url}`);
      }
      return response.json();
    })
    .then(data => {
      resolve(data);
    })
    .catch(error => {
      reject(`Error when load ${input_get_data.url}`);
    });
  });
}



