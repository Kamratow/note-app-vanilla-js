const deleteNoteDialog = document.getElementById("deleteNoteDialog");
const deleteNoteDialogCancelBtn = document.getElementById(
  "deleteNoteDialogCancelBtn"
);
const deleteNoteDialogDeleteBtn = document.getElementById(
  "deleteNoteDialogDeleteBtn"
);
const noteFormWrapper = document.getElementById("noteFormWrapper");
const noteFormTitle = document.getElementById("noteFormTitle");
const noteForm = document.getElementById("noteForm");
const noteListWrapper = document.getElementById("noteListWrapper");
const emptyNotesWrapper = document.getElementById("emptyNotesWrapper");
const displayNotesWrapper = document.getElementById("displayNotesWrapper");
const noteFormCancelBtn = document.getElementById("noteFormCancelBtn");
const emptyNotesAddNewNoteBtn = document.getElementById(
  "emptyNotesAddNewNoteBtn"
);
const addNewNoteBtn = document.getElementById("addNewNoteBtn");
const searchInput = document.getElementById("searchInput");

let notes = [];
let currentlySelectedNoteIndex = null;
let currentNoteFormMode = null;

function createNewNote(noteData) {
  const newNoteElement = document.createElement("li");
  newNoteElement.className = "noteListItemWrapper";
  newNoteElement.innerHTML = `
            <div class="noteListItemHeader">
              <span class="noteListItemTitle">${noteData.title}</span>
              <div class="noteListItemActionsWrapper">
                <button
                  type="button"
                  class="noteListItemActionsBtn noteListItemEditNoteBtn"
                >
                  <img src="./assets/edit_icon.svg" alt="edit note icon" />
                </button>
                <button
                  type="button"
                  class="noteListItemActionsBtn noteListItemDeleteNoteBtn"
                >
                  <img src="./assets/delete_icon.svg" alt="delete note icon" />
                </button>
              </div>
            </div>
            <p class="noteListItemBody">${noteData.body}</p>
            <p class="noteListItemDate">${noteData.date}</p>
    `.trim();

  return newNoteElement;
}

function handleOpenDeleteNoteModal() {
  deleteNoteDialog.style.display = "flex";
  deleteNoteDialog.showModal();
}

function handleEditNoteFormOpen() {
  currentNoteFormMode = "edit";
  noteFormTitle.textContent = "Edit note";

  const currentlySelectedNote = notes[currentlySelectedNoteIndex];
  noteForm.elements["noteTitle"].value = currentlySelectedNote.title;
  noteForm.elements["noteBody"].value = currentlySelectedNote.body;
  noteFormWrapper.style.display = "block";
  addNewNoteBtn.style.display = "none";
}

searchInput.addEventListener("input", function (e) {
  const searchValue = e.target.value;

  if (searchValue === "") {
    noteListWrapper.childNodes.forEach((singleListItem) => {
      singleListItem.style.display = "flex";
    });
  } else {
    noteListWrapper.childNodes.forEach((singleListItem) => {
      const titleElementContent =
        singleListItem.querySelector(".noteListItemTitle").textContent;

      if (titleElementContent.includes(searchValue)) {
        singleListItem.style.display = "flex";
      } else {
        singleListItem.style.display = "none";
      }
    });
  }
});

document.addEventListener("click", function (e) {
  if (e.target?.classList?.contains("noteListItemDeleteNoteBtn")) {
    currentlySelectedNoteIndex = [
      ...document.getElementsByClassName("noteListItemDeleteNoteBtn"),
    ].indexOf(e.target);
    handleOpenDeleteNoteModal();
  }

  if (
    e.target?.parentElement?.classList?.contains("noteListItemDeleteNoteBtn")
  ) {
    currentlySelectedNoteIndex = [
      ...document.getElementsByClassName("noteListItemDeleteNoteBtn"),
    ].indexOf(e.target.parentElement);
    handleOpenDeleteNoteModal();
  }

  if (e.target?.classList?.contains("noteListItemEditNoteBtn")) {
    currentlySelectedNoteIndex = [
      ...document.getElementsByClassName("noteListItemEditNoteBtn"),
    ].indexOf(e.target);
    handleEditNoteFormOpen();
  }

  if (e.target?.parentElement?.classList?.contains("noteListItemEditNoteBtn")) {
    currentlySelectedNoteIndex = [
      ...document.getElementsByClassName("noteListItemEditNoteBtn"),
    ].indexOf(e.target.parentElement);
    handleEditNoteFormOpen();
  }
});

function handleNewNoteFormOpen() {
  currentlySelectedNoteIndex = null;
  currentNoteFormMode = "new";
  noteFormTitle.textContent = "Add new note";
  noteFormWrapper.style.display = "block";
  emptyNotesWrapper.style.display = "none";
  addNewNoteBtn.style.display = "none";
}

emptyNotesAddNewNoteBtn.addEventListener("click", handleNewNoteFormOpen);

addNewNoteBtn.addEventListener("click", handleNewNoteFormOpen);

function handleHideDeleteNoteDialog() {
  deleteNoteDialog.style.display = "none";
  deleteNoteDialog.close();
}

deleteNoteDialogCancelBtn.addEventListener("click", function (e) {
  currentlySelectedNoteIndex = null;
  handleHideDeleteNoteDialog();
});

deleteNoteDialogDeleteBtn.addEventListener("click", function (e) {
  notes.splice(currentlySelectedNoteIndex, 1);
  noteListWrapper.removeChild(
    noteListWrapper.children[currentlySelectedNoteIndex]
  );
  currentlySelectedNoteIndex = null;

  handleHideDeleteNoteDialog();

  if (notes.length === 0) {
    emptyNotesWrapper.style.display = "flex";
    addNewNoteBtn.style.display = "none";
  }
});

noteForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const noteFormData = new FormData(this);
  const noteFormSubmitDate = new Date();
  const noteDate = noteFormSubmitDate.toLocaleString("en-us", {
    month: "long",
    year: "2-digit",
  });

  const noteData = {
    title: noteFormData.get("noteTitle"),
    body: noteFormData.get("noteBody"),
    date: noteDate,
  };

  const newNoteElement = createNewNote(noteData);

  if (currentNoteFormMode === "new") {
    notes.push(noteData);

    noteListWrapper.appendChild(newNoteElement);

    if (notes.length === 1) {
      emptyNotesWrapper.style.display = "none";
      displayNotesWrapper.style.display = "block";
    }
  } else {
    notes[currentlySelectedNoteIndex] = noteData;

    noteListWrapper.children[currentlySelectedNoteIndex].replaceWith(
      newNoteElement
    );
  }

  currentlySelectedNoteIndex = null;
  noteFormWrapper.style.display = "none";
  addNewNoteBtn.style.display = "block";
  noteListWrapper.style.display = "block";
  noteForm.elements["noteTitle"].value = "";
  noteForm.elements["noteBody"].value = "";
});

noteFormCancelBtn.addEventListener("click", function (e) {
  currentlySelectedNoteIndex = null;
  noteFormWrapper.style.display = "none";

  if (notes.length === 0) {
    emptyNotesWrapper.style.display = "flex";
  } else {
    addNewNoteBtn.style.display = "block";
    noteListWrapper.style.display = "block";
  }
});
