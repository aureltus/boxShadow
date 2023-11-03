/****************************************
 * Initialisation et configuration
 ****************************************/

const box = document.querySelector(".box"),
  blur = document.getElementById("blur"),
  color = document.getElementById("colorShadow"),
  spread = document.getElementById("spread"),
  axeX = document.getElementById("axe-X"),
  axeY = document.getElementById("axe-Y"),
  opacity = document.getElementById("opacity");

const btn = document.querySelector(".btn");
const insetCheckbox = document.querySelector("#inset");

const widthBox = document.getElementById("widthBox"),
  heightBox = document.getElementById("heightBox"),
  borderRadius = document.getElementById("borderRadius"),
  colorBox = document.getElementById("colorShadowBox");

const shadowPreview = document.getElementById("shadowPreview");
// tableau contenant les ombres
const previousShadows = [];

box.style.boxShadow = `${axeX.value}px ${axeY.value}px ${blur.value}px ${spread.value}px ${color.value}`;

// Déclare une variable pour combiner plusieurs ombres
let combinedShadows;

const previousShadowsContainer = document.getElementById(
  "previousShadowsContainer"
);

updatePreviousShadows();

/****************************************
 * Gestion des événements
 ****************************************/

color.addEventListener("input", updateShadowPreview);
insetCheckbox.addEventListener("input", updateShadowPreview);

btn.addEventListener("click", () => {
  // Ajoute l'ombre générée à la liste des ombres précédentes
  previousShadows.push(shadowPreview.style.boxShadow); // Ajouter l'ombre de l'aperçu à la liste des ombres précédentes
  const combinedShadows = previousShadows.join(", ");
  box.style.boxShadow = shadowPreview.style.boxShadow; // Appliquer l'ombre à la boîte
  updatePreviousShadows();
});

colorBox.addEventListener("input", boxSize);

const btnCopie = document.getElementById("copie");
btnCopie.addEventListener("click", () => {
  document.getElementById("shadowInput").select();
  document.execCommand("copy");
});

const rangeResults = document.querySelectorAll(".range-result");
rangeResults.forEach(function (rangeResult) {
  const rangeInput = document.querySelector("#" + rangeResult.dataset.input);
  if (rangeInput) {
    rangeResult.value = rangeInput.value;
    rangeInput.addEventListener("input", function () {
      rangeResult.value = this.value;
      boxSize();
      updateShadowPreview();
    });
  }
});

const numResult = document.querySelectorAll(".num-result");
numResult.forEach(function (numResult) {
  const rangeInput = document.querySelector("#" + numResult.dataset.input);
  if (rangeInput) {
    numResult.value = rangeInput.value;
    rangeInput.addEventListener("change", function () {
      // Vérifie si la valeur dépasse la limite supérieure
      if (Number(rangeInput.value) > Number(numResult.max)) {
        rangeInput.value = numResult.max;
      }
      // Vérifie si la valeur est inférieure à la limite inférieure
      if (Number(rangeInput.value) < Number(numResult.min)) {
        rangeInput.value = numResult.min;
      }
      numResult.value = this.value;
      boxSize();
      updateShadowPreview();
    });
  }
});

/****************************************
 * Fonctions
 ****************************************/

//Met à jour en temps réel l'ombre
function updateShadowPreview() {
  // Récupère l'opacité ajustée (sous forme hexadécimale)
  let opacityAdjusted =
    opacity.value === 1 ? "" : Math.floor(opacity.value * 255).toString(16);
  if (opacityAdjusted.length === 1) {
    // Ajoute un zéro de remplissage si nécessaire
    opacityAdjusted = 0 + opacityAdjusted;
  }
  // Crée la chaîne d'ombre avec les valeurs actuelles
  const shadowStyle = `${insetCheckbox.checked ? "inset" : ""} ${
    axeX.value
  }px ${axeY.value}px ${blur.value}px ${spread.value}px ${
    color.value
  }${opacityAdjusted}`;
  previousShadows.pop(); // Supprimer la dernière ombre pour éviter les doublons
  previousShadows.push(shadowStyle); // Ajoute l'ombre actuelle à la liste des ombres précédentes
  combinedShadows = previousShadows.join(", "); // Combine toutes les ombres dans une seule chaîne
  shadowPreview.style.boxShadow = combinedShadows;

  copyInput(); // Copie la valeur générée dans l'input de copie
}

// Copie la valeur générée dans le presse-papiers
function copyInput() {
  const elem = document.querySelector(".shadowInput");
  elem.value = combinedShadows;
}

// Met à jour la taille et la couleur de la box
function boxSize() {
  box.style.height = `${heightBox.value}px`;
  box.style.width = `${widthBox.value}px`;
  box.style.borderRadius = `${borderRadius.value}px`;
  box.style.backgroundColor = `${colorBox.value}`;
}

function updatePreviousShadows() {
  // Efface le contenu de l'élément HTML qui affiche les bouttons des ombres
  previousShadowsContainer.innerHTML = "";
  // Parcourt la liste des ombres dans le tableau des ombres
  previousShadows.forEach((shadow, index) => {
    if (index !== previousShadows.length - 1) {
      // Exclure le dernier element (qui contient toutes les ombres )

      // Crée un élément div pour le bouton de suppression de l'ombre
      const shadowElement = document.createElement("div");
      shadowElement.classList.add("shadow-item"); // Ajout de la classe CSS
      shadowElement.textContent = `shadow${index + 1}`; //ajout d'un nom via l'index
      // utiliser shadow pour avoir la valeur de l'ombre au survole
      shadowElement.title = shadow;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.classList.add("btn"); // Ajout de la classe CSS

      // Crée un bouton de suppression pour supprimer l'ombre
      deleteButton.addEventListener("click", () => {
        previousShadows.splice(index, 1);
        updatePreviousShadows();
        updateShadowPreview();
      });

      // Ajoute le bouton de suppression à l'ombre
      shadowElement.appendChild(deleteButton);
      previousShadowsContainer.appendChild(shadowElement);
    }
  });
}
/****************************************/
