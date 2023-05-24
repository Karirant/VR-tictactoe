let playerPlayedSlots = [];
let enemyPlayedSlots = [];
let allPlayedSlots = [];
let allowClick = true;

AFRAME.registerComponent("slot-click", {
  schema: {},
  init: function () {
    const el = this.el;

    const WINNINGCOMBINATIONS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const slotArr = Array.from(document.querySelectorAll(".slot"));
    const slots = document.querySelectorAll(".slot");

    const X = () => {
      let lineA = document.createElement("a-entity");
      lineA.setAttribute("geometry", "primitive: box");
      lineA.setAttribute("position", "0 0 -0.2");
      lineA.setAttribute("material", "color: #00F6FB");
      lineA.setAttribute("rotation", "0 0 45 ");
      lineA.setAttribute("scale", "0.8 0.12 0.8");
      let lineB = document.createElement("a-entity");
      lineB.setAttribute("geometry", "primitive: box");
      lineB.setAttribute("position", "0 0 -0.2");
      lineB.setAttribute("material", "color: #00F6FB");
      lineB.setAttribute("rotation", "0 0 -45");
      lineB.setAttribute("scale", "0.8 0.12 0.8");
      return [lineA, lineB];
    };

    const O = () => {
      let ring = document.createElement("a-entity");
      ring.setAttribute("geometry", "primitive: ring");
      ring.setAttribute("position", "0 0 -0.8");
      ring.setAttribute("material", "color: #FF0087");
      ring.setAttribute("rotation", "0 180 0");
      ring.setAttribute("scale", ".3 .3");
      return ring;
    };

    const winCheck = (playedSlots) => {
      console.log("playerPlayedSlots " + playerPlayedSlots);
      const isWinningCombination = WINNINGCOMBINATIONS.some((combination) => {
        return combination.every((index) => {
          return playedSlots.includes(index.toString());
        });
      });

      return isWinningCombination;
    };

    function rnd(max) {
      return Math.floor(Math.random() * max);
    }

    this.enemyTurn = () => {
      let enemyMoveRnd = rnd(8);
      let enemyMove = enemyMoveRnd.toString();

      if (allPlayedSlots.includes(enemyMove)) {
        this.enemyTurn();
      } else {
        allPlayedSlots.push(enemyMove.toString());
        let enemySlots = document.querySelectorAll(".slot");

        enemySlots[enemyMove].append(O());
        enemySlots[enemyMove].setAttribute(
          "animation",
          "property: rotation; to: 0, 180, 0"
        );
        enemySlots[enemyMove].setAttribute("material", "color: #0C6EA9");
      }
    };

    this.triggerSlot = () => {
      if (allowClick) {
        allowClick = false;

        // draw the X and turn the slot
        el.append(...X());
        el.setAttribute("animation", "property: rotation; to: 0, 180, 0");
        el.setAttribute("material", "color: #0C6EA9");

        playerPlayedSlots.push(el.id);
        allPlayedSlots.push(el.id);

        const isPlayerWinning = winCheck(playerPlayedSlots);

        if (isPlayerWinning) {
          console.log("Player wins!");
          allowClick = false;
        } else {
          setTimeout(() => {
            this.enemyTurn();
            allowClick = true;
          }, 1500);
        }
      } // triggerSlot
    };

    this.el.addEventListener("click", this.triggerSlot);
  },

  remove: function () {
    this.el.removeEventListener("click", this.triggerSlot);
  },
});
