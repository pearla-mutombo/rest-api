const formTag = document.getElementById("harry-form");
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const successEl = document.getElementById("success");

formTag.onsubmit = handleSubmit;

async function handleSubmit(event) {
  event.preventDefault();
  // Clear any existing logs or messages from previous attempts
  errorEl.innerHTML = "";
  successEl.innerHTML = "";
  outputEl.innerHTML = "";

  try {
    // 1. correctly tigger both fetches simmultaneously using the PotterAPI
    const [response1, response2] = await Promise.all([
      fetch("https://potterapi-fedeperin.vercel.app/en/books"),
      fetch("https://potterapi-fedeperin.vercel.app/en/characters"),
    ]);
    // 2. safely parse both incoming json result streams simmultaneously
    const [booksResult, charactersResult] = await Promise.all([
      response1.json(),
      response2.json(),
    ]);
    // 3. picks random index based on the array length (Note: i used a math.floor
    // because its a function that rounds a number down to the nearest whole integers;
    // it drops the decimal entirely, leaving us with the perfect whole number of 0 to 6,
    // which match the exact arrays indexes of my books in the api url that i choose.)
    const randomBookIndex = Math.floor(Math.random() * booksResult.length);
    const randomBook = booksResult[randomBookIndex];

    const randomCharIndex = Math.floor(Math.random() * charactersResult.length);
    const randomCharacter = charactersResult[randomCharIndex];

    // 4. safely seperated variables from the randomized selections
    const titleData = randomBook.title;
    const descriptionData = randomBook.description;
    const fullNameData = randomCharacter.fullName;
    const imageData = randomCharacter.image;
    const hogwartsHouse = randomCharacter.hogwartsHouse;

    // 5. style the updates and properly render the picture inside an <img> element
    outputEl.style.color = "#00ff66";
    successEl.innerHTML = "Success! Here are your facts:";
    outputEl.innerHTML = `
      <h3>Book: ${titleData}</h3>
      <p><strong>Description:</strong> ${descriptionData}</p>
      <hr>
      <h3>Character: ${fullNameData}</h3>
      <p><strong>House:</strong> ${hogwartsHouse || "Unknown"}</p>
      <img src="${imageData}" alt="${fullNameData}" style="max-width: 150px; display: block; margin-top: 10px; border-radius: 4px;">
    `;
    // 6. console logs the result for verification that it succeded or failed.
    console.log("Title:", titleData);
    console.log("Description:", descriptionData);
    console.log("Full Name:", fullNameData);
    console.log("Image URL:", imageData);
    console.log("Hogwarts House:", hogwartsHouse);
  } catch (error) {
    console.error("Error processing Harry Potter data:", error);
    errorEl.style.color = "Red";
    errorEl.innerHTML =
      "Failed to load Harry Potter facts. Please check try again and check your connection.";
  }
}
// I wanted to try something different that we haven't done in class 
// and that was fetching two URL simmultaneously, which i researched and 
// i was able to do so that was kinda cool. it was difficult 
// to find an API that used the "POST" method 
// which was what i wanted to do to begin with.