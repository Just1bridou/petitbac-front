/* eslint-disable react-hooks/rules-of-hooks */
import "./style.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Layout } from "components/layout";
import Header from "components/header";
import { Chat } from "components/chat";
import { emojisplosions } from "emojisplosion";
import lod_ from "lodash";

export const FinalScore = () => {
  const { party } = useSelector((state) => state);
  const [openChat, setOpenChat] = useState(false);

  const classement = ["gold", "silver", "copper"];

  const [sortedScore, setSortedScore] = useState([]);

  function getPseudoByUUID(uuid) {
    return party.users.find((u) => u.uuid === uuid).pseudo;
  }

  useEffect(() => {
    let { cancel } = emojisplosions({
      emojis: ["🚀", "👏", "⭐️", "🏆", "🥇", "😄"],
    });
    setTimeout(() => {
      cancel();
    }, 4000);

    let copyScore = lod_.cloneDeep(party.score);
    let sortedScore = copyScore.sort((a, b) => b.score - a.score);
    setSortedScore(sortedScore);
  }, [party]);

  return (
    <Layout
      horizontalAlign="start"
      verticalAlign="start"
      style={{
        margin: "10px 20px",
      }}
    >
      <Chat
        openChat={openChat}
        closeChat={() => setOpenChat(false)}
        onClick={() => setOpenChat(true)}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
        }}
      />
      <Header title={`Résultats finaux`}></Header>

      <div className="gameContent">
        {sortedScore.map((score, index) => {
          let name = getPseudoByUUID(score.uuid);
          // let name = score.name;
          let className = classement[index] ?? "bronze";

          return (
            <div key={index} className="resultsLinesContainer">
              <h1>{`#${index + 1}`}</h1>
              <div className={`resultLine ${className}`}>
                <h1 className="resultLineName">{name}</h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  <h1 className="resultLineScore">{score.score}</h1>
                  <span className="resultLineScoreLabel">Pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};
