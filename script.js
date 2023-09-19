const projects = [];

document.addEventListener("DOMContentLoaded", function () {
  const projectForm = document.getElementById("projectForm");
  const projectsDiv = document.getElementById("projects");

  projectForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const documentFile = document.getElementById("document").files[0];
    const imageFiles = Array.from(document.getElementById("images").files);
    const videoFiles = Array.from(document.getElementById("videos").files);
    // const folderFiles = Array.from(document.getElementById("folder").files);

    const reader = new FileReader();

    reader.onload = function (event) {
      const documentData = event.target.result;

      const project = {
        title: title,
        document: {
          name: documentFile.name,
          data: documentData,
        },
        images: imageFiles,
        videos: videoFiles,
        // folder: folderFiles,
      };

      projects.push(project);

      projectForm.reset();

      // Display the projects
      displayProjects();
    };

    reader.readAsDataURL(documentFile);
  });

  function deleteFile(projectIndex, fileType, fileIndex) {
    if (fileType === "images") {
      projects[projectIndex].images.splice(fileIndex, 1);
    } else if (fileType === "videos") {
      projects[projectIndex].videos.splice(fileIndex, 1);
    }

    displayProjects();
  }

  // Function to delete a project
  function deleteProject(index) {
    if (index >= 0 && index < projects.length) {
      projects.splice(index, 1);
      displayProjects(); // Refresh the displayed projects
    } else {
      console.error("Invalid project index for deletion.");
    }
  }

  projectsDiv.addEventListener("click", function (event) {
    const target = event.target;

    if (target.tagName === "BUTTON") {
      const projectIndex = target.getAttribute("data-project-index");
      const fileType = target.getAttribute("data-file-type");
      const fileIndex = target.getAttribute("data-file-index");

      if (fileType === "project") {
        deleteProject(projectIndex);
      } else if (fileType === "file") {
        deleteFile(projectIndex, fileType, fileIndex);
      }
    }
  });

  function displayProjects() {
    projectsDiv.innerHTML = ''; // Clear the existing content

    projects.forEach((project, index) => {
      const projectDiv = document.createElement("div");
      projectDiv.innerHTML = `
                <h2>${project.title}</h2>
                <p>Document: ${project.document.name}</p>
                <h3>Images:</h3>
                <ul>
                    ${project.images
                      .map(
                        (file, fileIndex) => `
                        <li>${file.name} <button data-project-index="${index}" data-file-type="file" data-file-index="${fileIndex}">Delete</button></li>
                    `
                      )
                      .join("")}
                </ul>
                <h3>Videos:</h3>
                <ul>
                    ${project.videos
                      .map(
                        (file, fileIndex) => `
                        <li>${file.name} <button data-project-index="${index}" data-file-type="file" data-file-index="${fileIndex}">Delete</button></li>
                    `
                      )
                      .join("")}
                </ul>
                <button data-project-index="${index}" data-file-type="project">Delete Project</button>
            `;
      projectsDiv.appendChild(projectDiv);
    });
  }
});
