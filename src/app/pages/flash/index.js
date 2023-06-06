/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "app/context/ws";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "components/layout";
import Header from "components/header";
import { PrimaryInput } from "components/buttons";
import { IconButton, Tooltip } from "@mui/material";
import { PrimaryButton } from "components/buttons";
import { SpecialButton } from "components/buttons";
import { updateThemeWords } from "app/redux/slices/flash";
import { createFlash } from "app/redux/slices/flash";
import lod_ from "lodash";
import ScrollFade from "@benestudioco/react-scrollfade/dist/ScrollFade";
import { Share, WarningAlt } from "@carbon/icons-react";
import { display } from "app/redux/slices/snackBar";
import { updateFlashActualScore } from "app/redux/slices/flash";
import { updateFlashFinish } from "app/redux/slices/flash";
import { updateFlashIndex } from "app/redux/slices/flash";
import { copyToClipboard } from "components/pannel";
import { startFlash } from "app/redux/slices/flash";
import { formatTime } from "components/pannel";
import { resetFlash } from "app/redux/slices/flash";

const EndGameResults = ({ flash }) => {
  const dispatch = useDispatch();

  const addIntSymbol = (number) => {
    if (number >= 0) {
      return `+${number}`;
    } else {
      return number;
    }
  };

  const generateClipboardText = (flash) => {
    let time = formatTime(
      new Date(flash.endDate).getTime() - new Date(flash.startDate).getTime()
    );

    let text = `Petit Bac Flash ${new Date().toLocaleDateString()} : ${
      flash.actualScore
    } Pts. en ${time} 🎉\n\n`;
    // text += "```";
    for (let theme of flash.themes) {
      let score = 0;

      for (let word of theme.words) {
        score += word.score;
      }

      let lastWord = theme.words[theme.words.length - 1];
      let textWord = "";
      if (lastWord.skiped) {
        textWord = "⬛❌⬛";
      } else {
        textWord = "⬛✅⬛";
      }

      text += `${theme.emoji}${textWord} ${addIntSymbol(score)} Pts. ${
        lastWord.skiped ? "(Thème passé)" : ""
      }\n`;
    }
    // text += "```";
    text += `\nEssaie de me battre sur https://${window.location.host}/flash`;
    return text;
  };

  return (
    <div className="flash_endGame">
      <div className="flash_endGameTitle">{`Fin de la partie 🎉`}</div>
      <div className="flash_endGameSubTitle">{`Du ${new Date().toLocaleDateString()}`}</div>
      <div className="flash_resultsList">
        <table
          style={{
            width: "100%",
          }}
        >
          <thead>
            <tr className="flash_tableHeader">
              <th>Thème</th>
              <th>Lettre</th>
              <th>Dernier Mot</th>
              <th>Points</th>
              <th>Essais</th>
            </tr>
          </thead>
          {flash.themes.map((theme, index) => {
            let score = 0;

            for (let word of theme.words) {
              score += word.score;
            }

            const formatWord = (word) => {
              word = word.toLowerCase();
              word = word.charAt(0).toUpperCase() + word.slice(1);
              return word;
            };

            const getLastWord = (theme) => {
              let lastWord = theme.words[theme.words.length - 1];

              if (lastWord.skiped) {
                return <td className="flash_skippedTable">Passé</td>;
              }

              return <td>{formatWord(lastWord.word)}</td>;
            };

            return (
              <tbody key={index}>
                <tr className="flash_resultCell">
                  <td>{theme.label}</td>
                  <td>{theme.letter}</td>
                  {getLastWord(theme)}
                  <td>{score}</td>
                  <td>{`${theme.words.length} essais`}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div className="flash_shareResultContainer">
        <div>
          <SpecialButton
            variant="pink"
            value={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Share />
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Partager mon résultat !
                </span>
              </div>
            }
            onClick={() => {
              copyToClipboard(generateClipboardText(flash));
              dispatch(
                display({
                  message: "Résultat copié dans le presse-papier !",
                  type: "success",
                })
              );
            }}
            style={{
              fontSize: "20px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const FlashHistory = ({ reportError, themes }) => {
  let reverseThemes = [...themes].reverse();
  return reverseThemes.map((theme) => {
    let reverseWords = [...theme.words].reverse();
    return reverseWords.map((word, index) => {
      return (
        <div key={index}>
          <div className="flash_historyWordsContainer">
            <div>
              <span className="flash_historyWordsTheme">{`${theme.label} :`}</span>
              <span className="flash_historyWordsWord">
                {word.word ?? "Skiped"}
              </span>
            </div>
            <span
              className={`flash_historyWordsScore ${
                word.score < 0 ? "flash_negativeScore" : "flash_positiveScore"
              }`}
            >
              <div className="flash_reportHistoryContainer">
                <span>{word.score}</span>
                <span className="flash_reportHistoryButton">
                  <Tooltip
                    hidden={word.skiped}
                    title="Signaler une erreur"
                    placement="top"
                    arrow
                  >
                    <IconButton
                      disabled={word.skiped}
                      color="error"
                      onClick={() => {
                        reportError({
                          theme: theme,
                          // letter: actualLetter,
                          word: word.word,
                        });
                      }}
                    >
                      <WarningAlt width={24} height={24} />
                    </IconButton>
                  </Tooltip>
                </span>
              </div>
            </span>
          </div>
        </div>
      );
    });
  });
};

export const FlashPage = () => {
  // const { party, user } = useSelector((state) => state);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  const { flash } = useSelector((state) => state);

  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  // thmes and letter
  const [themesList, setThemesList] = useState([]);
  // const [actualLetter, setActualLetter] = useState(null);
  // Input gesture
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(1);
  // word in input
  const [inputWord, setInputWord] = useState("");

  const [gameIsFinish, setGameIsFinish] = useState(false);

  const startGame = () => {
    getThemesList();
  };

  function getThemesList() {
    socket.emit("getThemesList", (data) => {
      // setActualLetter(data.letter);
      setThemesList(data.themes);
      setMaxIndex(data.themes.length - 1);

      dispatch(
        createFlash({
          date: new Date(),
          // actualLetter: data.letter,
          actualScore: 0,
          index: 0,
          finish: false,
          isStarted: true,
          themes: data.themes,
        })
      );

      if (!isStarted) {
        setIsStarted(true);
        dispatch(startFlash());
      }
    });
  }

  function calculateFinalScore(baseScore, timeSpentInMilliseconds) {
    const timePenaltyFactor = 0.05;
    let timeSpentInSeconds = timeSpentInMilliseconds / 1000;
    let timePenalty = Math.round(timeSpentInSeconds * timePenaltyFactor);
    let finalScore = Math.round(baseScore - timePenalty);
    return { finalScore, timePenalty };
  }

  function nextWord() {
    if (index < maxIndex) {
      let nIndex = index + 1;
      setIndex(nIndex);
      dispatch(updateFlashIndex(nIndex));
    } else {
      // TODO
      let end = new Date();
      let { finalScore, timePenalty } = calculateFinalScore(
        score,
        end.getTime() - new Date(flash.startDate).getTime()
      );
      setScore(finalScore);
      dispatch(
        updateFlashFinish({
          finish: true,
          score: finalScore,
          endDate: end,
          timePenalty,
        })
      );
      setGameIsFinish(true);
    }
  }

  function skipWord() {
    setInputWord("");
    nextWord();

    let updatedScore = score - 20;
    setScore(updatedScore);
    dispatch(updateFlashActualScore(updatedScore));

    let words = lod_.cloneDeep(flash.themes[index].words);
    words.push({
      word: null,
      score: -20,
      finded: false,
      skiped: true,
    });

    dispatch(
      updateThemeWords({
        themeIndex: index,
        words: words,
        finded: false,
        skiped: true,
      })
    );
  }

  function validate() {
    const updateScore = (newScore, finded) => {
      let updatedScore = score + newScore;
      setScore(updatedScore);
      dispatch(updateFlashActualScore(updatedScore));

      let words = lod_.cloneDeep(flash.themes[index].words);
      words.push({
        word: inputWord,
        score: newScore,
        finded: finded,
      });

      dispatch(
        updateThemeWords({
          themeIndex: index,
          words: words,
          finded: finded,
        })
      );
    };

    socket.emit(
      "verifyGame",
      {
        theme: themesList[index].theme,
        letter: themesList[index].letter,
        word: inputWord,
      },
      (res) => {
        if (res.finded) {
          setInputWord("");
          nextWord();
          updateScore(50 + res.score, true);
        } else {
          setInputWord("");
          updateScore(-15, false);
        }
      }
    );
  }

  function initState() {
    setIsStarted(flash.isStarted);
    setScore(flash.actualScore);
    //  setActualLetter(flash.actualLetter);
    setIndex(flash.index);
    setGameIsFinish(flash.finish);
    setThemesList(flash.themes);
    setMaxIndex(flash.themes.length - 1);
  }

  function reportError(data) {
    dispatch(
      display({
        type: "info",
        message:
          "Erreur signalée, un administrateur va vérifier si le mot et valide pour l'ajouter au dictionnaire",
      })
    );
    socket.emit("reportError", data, (res) => {});
  }

  useEffect(() => {
    if (!lod_.isEmpty(flash)) {
      let todayDate = new Date().toLocaleDateString();
      let flashDate = new Date(flash.date).toLocaleDateString();

      if (todayDate !== flashDate) {
        dispatch(resetFlash());
      } else {
        initState();
      }
    }
  }, []);

  return (
    <Layout
      horizontalAlign="start"
      verticalAlign="start"
      style={{
        margin: "10px 20px",
      }}
    >
      <Header backMenu title="Party Flash"></Header>

      <div className="flash_gameContent">
        <div className="flash_gameContainer">
          {!isStarted && !gameIsFinish && (
            <div>
              <div className="flash_title">Mode Flash ⚡️</div>
              <div className="flash_description">
                <p>Nouveau mode de jeu !</p>
                <p>Chaque jour une nouvelle grille de 10 thèmes à résoudre.</p>
                <p>
                  Soyer le plus rapide pour gagner un maximum de points ! 🏆
                </p>
                <p>Attention, chaque erreur vous fera perdre des points ! 😱</p>
                <p>
                  Si vous trouvez un mot qui est compté comme faux et qui n'est
                  pas dans le dictionnaire, vous pouvez le signaler en cliquant
                  sur le bouton <span>Signaler</span> en bas à droite du mot
                  dans l'historique.
                </p>
              </div>
            </div>
          )}
          {/* In game screen */}
          {isStarted && !gameIsFinish && flash.startDate && (
            <div className="flash_inputContent">
              <div className="wordCellCategorie">
                {`${themesList[index].label} en`}&nbsp;
                <span>{themesList[index].letter}</span>
              </div>
              <PrimaryInput
                value={inputWord}
                onChange={(e) => {
                  setInputWord(e.target.value);
                }}
                type="text"
                placeholder={`${themesList[index].letter} ...`}
                style={{
                  width: "100%",
                  padding: "20px 30px",
                  textTransform: "uppercase",
                  fontStyle: "normal",
                }}
                spellCheck={false}
                onEnterPress={() => {
                  validate();
                }}
              />
              <div className="flash_buttonsContainer">
                <SpecialButton
                  variant="pink"
                  value="Passer"
                  onClick={skipWord}
                  style={{
                    marginTop: "1rem",
                    padding: "2% 3%",
                    borderRadius: "20px",
                    flex: 1,
                    marginRight: "1rem",
                  }}
                />
                <PrimaryButton
                  value="Valider"
                  onClick={validate}
                  style={{
                    marginTop: "1rem",
                    padding: "2% 3%",
                    flex: 5,
                  }}
                />
              </div>
              <div className="wordCellCategorie" style={{ marginTop: "5vh" }}>
                Historique :
              </div>
              {
                <div className="flash_historyContainer">
                  <ScrollFade />
                  <FlashHistory
                    reportError={reportError}
                    // actualLetter={flash.actualLetter}
                    themes={lod_.cloneDeep(flash.themes)}
                  />
                </div>
              }
            </div>
          )}
          {/* End game screen */}
          {gameIsFinish && <EndGameResults flash={flash} />}
        </div>
      </div>
      {/* Before game screen */}
      {!isStarted && !gameIsFinish && (
        <div className="createPrivateRoom">
          <PrimaryButton
            value="Commencer"
            onClick={startGame}
            style={{
              width: "100%",
              height: "8vh",
              fontSize: "20px",
              marginBottom: "1vh",
            }}
          />
        </div>
      )}
    </Layout>
  );
};
