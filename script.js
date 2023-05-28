let playerPlayedSlots = [];
let enemyPlayedSlots = [];
let allPlayedSlots = [];
let allowClick = true;
let gameOver = false; // New variable to track game over state

const $ = _ => document.querySelector(_)
const $a = _ => document.querySelectorAll(_)
const $c = _ => document.createElement(_)

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

    const slotArr = Array.from($a(".slot"));
    const slots = $a(".slot");

    // player mark
    const X = () => {
      let lineA = $c("a-entity");
      lineA.setAttribute("geometry", "primitive: box");
      lineA.setAttribute("position", "0 0 -0.11");
      lineA.setAttribute("material", "color: #55defa");
      lineA.setAttribute("rotation", "0 0 45 ");
      lineA.setAttribute("scale", "0.8 0.12 0.8");
      let lineB = document.createElement("a-entity");
      lineB.setAttribute("geometry", "primitive: box");
      lineB.setAttribute("position", "0 0 -0.11");
      lineB.setAttribute("material", "color: #55defa");
      lineB.setAttribute("rotation", "0 0 -45");
      lineB.setAttribute("scale", "0.8 0.12 0.8");
      return [lineA, lineB];
    };

    // enemy mark
    const O = () => {
      let ring = document.createElement("a-entity");
      ring.setAttribute("geometry", "primitive: ring");
      ring.setAttribute("position", "0 0 -0.51");
      ring.setAttribute("material", "color: #b845f3");
      ring.setAttribute("rotation", "0 180 0");
      ring.setAttribute("scale", ".3 .3");
      return ring;
    };

    const winCheck = (playedSlots) => {
      const isWinningCombination = WINNINGCOMBINATIONS.some((combination) => {
        return combination.every((index) => {
          return playedSlots.includes(index.toString());
        });
      });

      return isWinningCombination;
    };

    const findWinningSlots = (playedSlots) => {
      const winningSlots = [];

      WINNINGCOMBINATIONS.forEach((combination) => {
        const isWinningCombination = combination.every((index) => {
          return playedSlots.includes(index.toString());
        });

        if (isWinningCombination) {
          combination.forEach((index) => {
            winningSlots.push(slotArr[index]);
          });
        }
      });

      return winningSlots;
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
        enemyPlayedSlots.push(enemyMove.toString());
        let enemySlots = $a(".slot");

        enemySlots[enemyMove].append(O());
        enemySlots[enemyMove].setAttribute(
          "animation",
          "property: rotation; to: 0, 180, 0"
        );
        enemySlots[enemyMove].setAttribute("material", "color: #283173");

        const isEnemyWinning = winCheck(enemyPlayedSlots);

        if (isEnemyWinning) {
          console.log("Enemy wins!");
          allowClick = false;
          gameOver = true; // Set gameOver to true
          const winningSlots = findWinningSlots(enemyPlayedSlots);
          const winningCombination = winningSlots.map((slot) => slot.id);
          console.log("Winning Combination:", winningCombination);

          // coloring the winning slots
          winningCombination.forEach((e) => {
            slots[e].setAttribute("material", "color: #b845f3");
            slots[e].firstChild.setAttribute("material", "color: #283173");
          });
        }
      }
    };

    this.triggerSlot = () => {
      if (allowClick && !gameOver) {
        // Check both allowClick and gameOver
        allowClick = false;

        // draw the X and turn the slot
        el.append(...X());
        el.setAttribute("animation", "property: rotation; to: 0, 180, 0");
        el.setAttribute("material", "color: #283173");

        playerPlayedSlots.push(el.id);
        allPlayedSlots.push(el.id);

        const isPlayerWinning = winCheck(playerPlayedSlots);

        if (isPlayerWinning) {
          console.log("Player wins!");
          allowClick = false;
          gameOver = true; // Set gameOver to true
          const winningSlots = findWinningSlots(playerPlayedSlots);
          const winningCombination = winningSlots.map((slot) => slot.id);
          console.log("Winning Combination:", winningCombination);

          // coloring the winning slots
          winningCombination.forEach((e) => {
            const children = Array.from(slots[e].children);
            slots[e].setAttribute("material", "color: #55defa");
            children.forEach((child) => {
              child.setAttribute("material", "color: #283173");
            });
          });
        } else {
          setTimeout(() => {
            this.enemyTurn();
            allowClick = true;
          }, 1500);
        }
      }
    };

    this.el.addEventListener("click", this.triggerSlot);
  },

  remove: function () {
    this.el.removeEventListener("click", this.triggerSlot);
  },
});
