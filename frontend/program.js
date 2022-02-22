fetch("/program")
  .then((response) => response.json())
  .then((data) => {
    const programs = data.programs;

    // for program details page
    /* 
     const user = JSON.parse(localStorage.getItem('user'));
     if (user.programs?.length > 0) {
       const hefesto = programs.find(program => program.name === "Hefesto");
       const videoLink = hefesto.videoLink;
       // REMOVE INQUIRY LINK
       // ADD VIDEO LINK
       return;
     }
     const hefesto = programs.find(program => program.name === "Hefesto");
     const userId = user._id
     const programId = hefesto._id

     // addEventListener onClick inquiry now button
     fetch("/inquiry-now", {
      method: "POST",
      body: { userId, programId },
      header: {
        "Content-Type": "application/json"
      }
     })
     // show message - your request will be processed within few days
    */
    // hefesto.name

    const firstProgram = programs.shift();
    const secondProgram = programs.shift();
    const thirdProgram = programs.shift();
    const fourthProgram = programs.shift();

    const programOneTitle = document.querySelector("#program-one-title");
    const programOneDesc = document.querySelector("#program-one-desc");
    programOneTitle.innerHTML = firstProgram.name;
    programOneDesc.innerHTML = firstProgram.description;
    console.log(firstProgram._id);
    console.log(secondProgram._id);
  });
