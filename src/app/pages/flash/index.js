/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "app/context/ws";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "components/layout";
import Header from "components/header";
import { PrimaryInput } from "components/buttons";
import { Button, LinearProgress, Tooltip } from "@mui/material";
import { PrimaryButton } from "components/buttons";
import { SpecialButton } from "components/buttons";
import { updateThemeWords } from "app/redux/slices/flash";
import { createFlash } from "app/redux/slices/flash";
import lod_ from "lodash";
import ScrollFade from "@benestudioco/react-scrollfade/dist/ScrollFade";
import {
  Checkmark,
  ChevronDown,
  Share,
  SkipForward,
  WarningAlt,
} from "@carbon/icons-react";
import { display } from "app/redux/slices/snackBar";
import { updateFlashActualScore } from "app/redux/slices/flash";
import { updateFlashFinish } from "app/redux/slices/flash";
import { updateFlashIndex } from "app/redux/slices/flash";
import { copyToClipboard } from "components/pannel";
import { startFlash } from "app/redux/slices/flash";
import { formatTime } from "components/pannel";
import { resetFlash } from "app/redux/slices/flash";
import { ChevronRight } from "@carbon/icons-react";

const ResultRow = ({ theme, getLastWord, score }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="flash_resultCell pointer" onClick={() => setOpen(!open)}>
        <td>
          {open ? (
            <ChevronDown width={15} height={15} />
          ) : (
            <ChevronRight width={15} height={15} />
          )}
        </td>
        <td>{theme.label}</td>
        <td>{theme.letter}</td>
        {getLastWord(theme)}
        <td>{score}</td>
        <td>{`${theme.words.length} essais`}</td>
      </tr>
      <tr
        className={`flash_resultDetails ${open ? "" : "flash_resultRowHidden"}`}
      >
        <td></td>
        <td colSpan="5" className="flash_resultCellDetails">
          <table>
            <thead>
              <tr>
                <th>Mot</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {theme.words.map((word, index) => {
                let skp = word.skiped;
                return (
                  <tr>
                    <td>{`${skp ? "Thème passé" : word.word}`}</td>
                    <td>{`${word.score} pts.`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
};

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
              <th></th>
              <th>Thème</th>
              <th>Lettre</th>
              <th>Dernier Mot</th>
              <th>Points</th>
              <th>Essais</th>
            </tr>
          </thead>
          <tbody>
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
                <ResultRow
                  key={index}
                  theme={theme}
                  getLastWord={getLastWord}
                  score={score}
                />
              );
            })}
          </tbody>
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
      let err = !word.finded;
      let skp = Boolean(word.skiped);
      return (
        <div key={index}>
          <div className="flash_historyWordsContainer">
            <div>
              <span className="flash_historyWordsTheme">{`${theme.label} :`}</span>
              <span className="flash_historyWordsWord">
                {word.word ? (
                  <span>{word.word}</span>
                ) : (
                  <span className="flash_rowSkipedWord">Thème passé</span>
                )}
              </span>
            </div>
            <span
              className={`flash_historyWordsScore ${
                word.score < 0 ? "flash_negativeScore" : "flash_positiveScore"
              }`}
            >
              <div className="flash_reportHistoryContainer">
                <span>{`${word.score}`}</span>
                {skp && (
                  <span className="flash_reportHistoryButton">
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      startIcon={<SkipForward width={15} height={15} />}
                    >
                      Passé
                    </Button>
                  </span>
                )}
                {err && !skp && (
                  <span className="flash_reportHistoryButton">
                    <Tooltip
                      hidden={word.skiped}
                      title="Signaler une erreur"
                      placement="top"
                      arrow
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<WarningAlt width={15} height={15} />}
                        onClick={() => {
                          reportError({
                            theme: theme.theme,
                            letter: theme.letter,
                            word: word.word,
                          });
                        }}
                      >
                        Signaler
                      </Button>
                    </Tooltip>
                  </span>
                )}

                {!skp && !err && (
                  <span className="flash_reportHistoryButton">
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<Checkmark width={15} height={15} />}
                    >
                      Valide
                    </Button>
                  </span>
                )}
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
    socket.timeout(5000).emit("getThemesList", (err, data) => {
      if (err) {
        console.log(`socket error: getThemesList: ${err}`);
        return;
      }
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
    const timePenaltyFactor = 0.1;
    let timeSpentInSeconds = timeSpentInMilliseconds / 1000;
    let timePenalty = Math.round(timeSpentInSeconds * timePenaltyFactor);
    let finalScore = Math.round(baseScore - timePenalty);
    return { finalScore, timePenalty };
  }

  function nextWord(updatedScore = null) {
    if (index < maxIndex) {
      let nIndex = index + 1;
      setIndex(nIndex);
      dispatch(updateFlashIndex(nIndex));
    } else {
      // TODO
      let end = new Date();
      let { finalScore, timePenalty } = calculateFinalScore(
        updatedScore || score,
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
    setInputWord("");
    nextWord(updatedScore);
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

    if (!inputWord?.trim()) return;

    socket.timeout(5000).emit(
      "verifyGame",
      {
        theme: themesList[index].theme,
        letter: themesList[index].letter,
        word: inputWord.trim(),
      },
      (err, res) => {
        if (err) {
          console.log(`socket error: verifyGame: ${err}`);
          return;
        }

        if (res.finded) {
          setInputWord("");
          updateScore(50 + res.score, true);
          nextWord();
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
    socket.timeout(5000).emit("reportError", data, (err, res) => {
      if (err) {
        console.log(`socket error: reportError: ${err}`);
      }
    });
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
                  Les points sont calculés avec la méthode du scrabble.
                  <br /> Plus le mot utilise des lettres rares, plus il rapporte
                  de points. 🚀
                </p>
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
                <div className="flash_themeHeader">
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <span className="flash_themeMaj">{`${themesList[index].emoji} ${themesList[index].label}`}</span>
                    &nbsp;
                    <span className="flash_themeMin">en</span>
                    &nbsp;
                    <span className="flash_themeMaj">
                      {themesList[index].letter}
                    </span>
                  </div>
                  <div className="flash_progressGame">
                    <div className="flash_progressGameText">{`Thème ${
                      index + 1
                    } / ${themesList.length}`}</div>
                    <div>
                      <LinearProgress
                        className="flash_progressGameBar"
                        variant="determinate"
                        value={(index + 1) * 10}
                        sx={{
                          height: "0.75rem",
                          backgroundColor: "#222249",
                          "& .MuiLinearProgress-bar": {
                            // backgroundColor: "#2D3FDD",
                            background: `linear-gradient(171.51deg, #b6bbee 0%, #2D3FDD 99.2%)`,
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
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
