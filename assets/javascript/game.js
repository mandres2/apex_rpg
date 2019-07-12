// This Executes the code when the Date Object Model has fully loaded.
$(document).ready(function() {
    
  // Under document.ready, this code ties the local link to the audioElement.
    var audioElement = document.createElement("audio");
    audioElement.setAttribute("src", "assets/audio/Apex.mp3");

    // APEX THEME BUTTON
    $(".theme-button").on("click", function() {
      audioElement.play();
    });
    $(".pause-button").on("click", function() {
      audioElement.pause();
    });

    // ============= VARIABLE DECLARATION ================ //

    // Creates an object to hold the characters. 
    var characters = {
      "WRAITH": {
        name: "WRAITH",
        health: 100,
        attack: 16,
        imageUrl: "https://www.novinspot.com/wp-content/uploads/2019/03/apex-legends-780x439.jpg",
        enemyAttackBack: 15
      },
      "OCTANE": {
        name: "OCTANE",
        health: 100,
        attack: 17,
        imageUrl: "https://i.ytimg.com/vi/-9IJiuQl2mo/maxresdefault.jpg",
        enemyAttackBack: 25
      },
      "BLOODHOUND": {
        name: "BLOODHOUND",
        health: 100,
        attack: 18,
        imageUrl: "https://media.comicbook.com/2019/05/apex-legends-1170715-1280x0.jpeg",
        enemyAttackBack: 20
      },
      "PATHFINDER": {
        name: "PATHFINDER",
        health: 100,
        attack: 16,
        imageUrl: "https://cdn.wccftech.com/wp-content/uploads/2019/02/apex_legends_robot.jpg",
        enemyAttackBack: 30
      },
      "BANGALORE": {
        name: "BANGALORE",
        health: 100,
        attack: 20,
        imageUrl: "https://d1fs8ljxwyzba6.cloudfront.net/assets/editorial/2019/02/apex-legends-bangalore-finisher.jpg",
        enemyAttackBack: 15
      },
      "WATTSON": {
        name: "WATTSON",
        health: 100,
        attack: 16,
        imageUrl: "https://ksassets.timeincuk.net/wp/uploads/sites/54/2019/07/2kx8vvnsrw731-920x518.png",
        enemyAttackBack: 17
      },
    };
  
    // Will appear when the player selects a character.
    var attacker;
    // Will appear with all the characters the player didn't select.
    var combatants = [];
    // Will be populated when the player chooses an opponent.
    var defender;
    // Will keep track of turns during combat. Used for calculating player damage.
    var turnCounter = 1;
    // Tracks number of defeated opponents.
    var killCount = 0;
  

    // ================= FUNCTIONS ================= //
  
    // This function will "render" a character card to the page.
    // The character rendered, the area they are rendered to, and their status is determined by the arguments passed in.
    var renderCharacter = function(character, renderArea) {
      // This block of code builds the character card, and renders it to the page.
      var charDiv = $("<div class='character' data-name='" + character.name + "'>");
      var charName = $("<div class='character-name'>").text(character.name);
      var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
      var charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(renderArea).append(charDiv);
    };
  
    // this function will load all the characters into the character section to be selected
    var initializeGame = function() {
      // Loop through the characters object and call the renderCharacter function on each character to render their card.
      for (var key in characters) {
        renderCharacter(characters[key], "#characters-section");
      }
    };
  
    // **running the function here**
    initializeGame();
  
    // This function handles updating the selected player or the current defender. If there is no selected player/defender, this
    // function will also place the character based on the areaRender chosen (e.g. #selected-character or #defender)
    var updateCharacter = function(charObj, areaRender) {
      // First we empty the area so that we can re-render the new object
      $(areaRender).empty();
      renderCharacter(charObj, areaRender);
    };
  
    // This function will render the available-to-attack enemies. This should be run once after a character has been selected
    var renderEnemies = function(enemyArr) {
      for (var i = 0; i < enemyArr.length; i++) {
        renderCharacter(enemyArr[i], "#available-to-attack-section");
      }
    };
  
      // Function to handle rendering game messages.
      var renderMessage = function(message) {
      // Builds the message and appends it to the page.
      var gameMessageSet = $("#game-message");
      var newMessage = $("#game-message").text(message);
      gameMessageSet.append(newMessage);
    };
  
    // Function which handles restarting the game after victory or defeat.
    var restartGame = function(resultMessage) {
      // When the 'Restart' button is clicked, reloads the page.
      var restart = $("<button style='margin-left: 325px'>Restart</button>").click(function() {
        location.reload();
      });
  
      // Build div that will display the victory/defeat message.
      var gameState = $("#game-message").text(resultMessage);
  
      // Render the restart button and victory/defeat message to the page.
      $("body").append(gameState);
      $("body").append(restart);
    };
  
    // Function to clear the game message section
    var clearMessage = function() {
      var gameMessage = $("#game-message");
  
      gameMessage.text("");
    };
  
    // ====================== ON CLICK EVENT =============================== //
  
    // On click event for selecting our character.
    $("#characters-section").on("click", ".character", function() {
      // Saving the clicked character's name.
      var name = $(this).attr("data-name");
  
      // If a player character has not yet been chosen...
      if (!attacker) {
        // We populate attacker with the selected character's information.
        attacker = characters[name];
        // We then loop through the remaining characters and push them to the combatants array.
        for (var key in characters) {
          if (key !== name) {
            combatants.push(characters[key]);
          }
        }
  
        // Hide the character select div.
        $("#characters-section").hide();
  
        // Then render our selected character and our combatants.
        updateCharacter(attacker, "#selected-character");
        renderEnemies(combatants);
      }
    });
  
    // Creates an on click event for each enemy.
    $("#available-to-attack-section").on("click", ".character", function() {
      // Saving the opponent's name.
      var name = $(this).attr("data-name");
  
      // If there is no defender, the clicked enemy will become the defender.
      if ($("#defender").children().length === 0) {
        defender = characters[name];
        updateCharacter(defender, "#defender");
  
        // remove element as it will now be a new defender
        $(this).remove();
        clearMessage();
      }
    });
  
    // When you click the attack button: F(x)...
    $("#attack-button").on("click", function() {
      // If there is a defender, combat will occur.
      if ($("#defender").children().length !== 0) {
        // Creates messages for our attack and our opponents counter attack.
        var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
        var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
        clearMessage();
  
        // Reduce defender's health by your attack value.
        defender.health -= attacker.attack * turnCounter;
  
        // If the enemy still has health..
        if (defender.health > 0) {
          // Render the enemy's updated character card.
          updateCharacter(defender, "#defender");
  
          // Render the combat messages.
          renderMessage(attackMessage);
          renderMessage(counterAttackMessage);
  
          // Reduce your health by the opponent's attack value.
          attacker.health -= defender.enemyAttackBack;
  
          // Render the player's updated character card with the updated HP.
          updateCharacter(attacker, "#selected-character");
  
          // If the user's chosen character has less than zero health the game ends.
          // We call the restartGame function to allow the user to restart the game and play again.
          if (attacker.health <= 0) {
            clearMessage();
            restartGame("You Have Been Eliminated");
            $("#attack-button").off("click");
          }
        }
        else {
          // If the enemy has less than zero health they are defeated.
          // This will remove the opponent's character card.
          $("#defender").empty();
  
          var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another enemy.";
          renderMessage(gameStateMessage);
  
          // Kill count increments.
          killCount++;
  
          // If the player killed all opponents, the player wins
          // CALL the restartGame function to allow the user to restart the game and play again.
          if (killCount >= combatants.length) {
            clearMessage();
            $("#attack-button").off("click");
            restartGame("You Are the Apex Champion");
          }
        }
        // Increment turn counter. This is used for determining how much damage the player does.
        turnCounter++;
      }
      else {
        // If there is no defender, render an error message.
        clearMessage();
        renderMessage("No Tangos In Sight");
      }
    });
  });
  