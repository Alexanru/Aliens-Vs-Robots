import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./MapBase.css";
import Modal from "./Modal";
import BossArena from "./BossArena";

const MapBase = ({
  player,
  npc,
  solidBlocks,
  isUp,
  isDown,
  isLeft,
  isRight,
  isModalOpen,
  setIsModalOpen,
  playerHealth,
  setPlayerHealth,
  enemyHealth,
  setEnemyHealth,
  playerStrength,
  setPlayerStrength,
  enemyStrength,
  setEnemyStrength,
  isDoorOpen,
  setIsDoorOpen,
  bossHealth,
  setBossHealth,
  bossStrength,
  isBoss,
  currentEnemy,
  setCurrentEnemy,
  talkCounter,
  setTalkCounter,
  enemyDeathCounter,
  setEnemyDeathCounter,
}) => {
  const size = 10;
  const [showBossArena, setShowBossArena] = useState(false);

  const createMapMatrix = () => {
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
      // First and last column
      matrix[i][0] = 1;
      matrix[i][size - 1] = 1;
    }
    for (let j = 0; j < size; j++) {
      // First and last row
      matrix[0][j] = 1;
      matrix[size - 1][j] = 1;
    }
    // define coordinates for the door
    matrix[2][2] = 8; // Door is a solid block if not open
    // Add solid blocks to the matrix
    solidBlocks.forEach((block) => {
      matrix[block.y][block.x] = 4;
    });

    matrix[player.y][player.x] = 2;
    matrix[npc.y][npc.x] = 3;

    return matrix;
  };

  const matrix = createMapMatrix();

  const renderTable = (matrix) => {
    return matrix.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => {
          let className = "";

          if (cell === 1) {
            className = "map-border";
          } else if (cell === 2) {
            className = `${
              (isUp ? "player-up" : "") ||
              (isDown ? "player-down" : "") ||
              (isLeft ? "player-left" : "") ||
              (isRight ? "player-right" : "") ||
              "player"
            }`;
          } else if (cell === 3) {
            className = "npc";
          } else if (cell === 4) {
            className = "map-border";
          } else if (cell === 8) {
            className = isDoorOpen ? "tp-open-metal" : "tp-closed-metal";
          }
          return <div key={colIndex} className={`cell ${className}`}></div>;
        })}
      </div>
    ));
  };

  useEffect(() => {
    if (player.x === npc.x && player.y === npc.y) {
      setIsModalOpen(true);
    }
  }, [player, npc, setIsModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (enemyHealth <= 0) {
      setIsDoorOpen(true);
      setEnemyDeathCounter(enemyDeathCounter + 1);
    }
  }, [enemyHealth]);

  useEffect(() => {
    if (isDoorOpen && player.x === 2 && player.y === 2) {
      setShowBossArena(true);
    }
  }, [player, isDoorOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    const randomX = Math.floor(Math.random() * (size - 2)) + 1;
    const randomY = Math.floor(Math.random() * (size - 2)) + 1;
    npc.x = randomX;
    npc.y = randomY;
  };

  const respawnEnemy = () => {
    const randomX = Math.floor(Math.random() * (size - 2)) + 1;
    const randomY = Math.floor(Math.random() * (size - 2)) + 1;
    npc.x = randomX;
    npc.y = randomY;
    setEnemyHealth(100); // Reset enemy health to 100
    closeModal();
  };

  if (showBossArena) {
    isBoss = true;
    setCurrentEnemy(2);
    return (
      <BossArena
        isModalOpen={isModalOpen}
        bossHealth={bossHealth}
        setBossHealth={setBossHealth}
        playerHealth={playerHealth}
        setPlayerHealth={setPlayerHealth}
        playerStrength={playerStrength}
        setPlayerStrength={setPlayerStrength}
        bossStrength={bossStrength}
        setIsModalOpen={setIsModalOpen}
        isBoss={isBoss}
        isUp={isUp}
        isDown={isDown}
        isLeft={isLeft}
        isRight={isRight}
        talkCounter={talkCounter}
        setTalkCounter={setTalkCounter}
      />
    );
  }

  return (
    <div className="map-base-container">
      <div className="map-base-table">{renderTable(matrix)}</div>
      {isModalOpen && (
        <Modal
          playerHealth={playerHealth}
          setPlayerHealth={setPlayerHealth}
          enemyHealth={enemyHealth}
          setEnemyHealth={setEnemyHealth}
          playerStrength={playerStrength}
          enemyStrength={enemyStrength}
          closeModal={closeModal}
          respawnEnemy={respawnEnemy}
          setPlayerStrength={setPlayerStrength}
          setEnemyStrength={setEnemyStrength}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  player: state.player.player,
  npc: state.player.npc,
  solidBlocks: state.player.solidBlocks,
});

export default connect(mapStateToProps)(MapBase);
