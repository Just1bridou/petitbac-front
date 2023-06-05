import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "app/context/ws";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "components/layout";
import Header from "components/header";
import { PrimaryInput } from "components/buttons";
import { Button, IconButton, Tooltip } from "@mui/material";
import { PrimaryButton } from "components/buttons";
import { SpecialButton } from "components/buttons";
import { updateThemeWords } from "app/redux/slices/flash";
import { createFlash } from "app/redux/slices/flash";
import lod_ from "lodash";
import { updateFlash } from "app/redux/slices/flash";
import ScrollFade from "@benestudioco/react-scrollfade/dist/ScrollFade";
import { WarningAlt } from "@carbon/icons-react";
import { display } from "app/redux/slices/snackBar";
import { updateFlashActualScore } from "app/redux/slices/flash";
import { updateFlashFinish } from "app/redux/slices/flash";
import { updateFlashIndex } from "app/redux/slices/flash";

const EndGameResults = ({ flash }) => {
  return (
    <div className="flash_endGame">
      <div className="flash_endGameTitle">Fin de la partie</div>
      <div className="flash_endGameScore">{`Score : ${flash.actualScore}`}</div>
      <div className="flash_resultsList">
        {flash.themes.map((theme, index) => {
          let score = 0;
          let skipped = false;

          for (let word of theme.words) {
            if (word.skiped) {
              skipped = true;
            }
            score += word.score;
          }
          return (
            <div className="flash_resultCell">
              <span>{`${theme.label} en `}</span>
              <span>{`${theme.letter} : `}</span>
              <span>{`${score} points en `}</span>
              <span>{`${theme.words.length} essai(s)`}</span>
            </div>
          );
        })}
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
    setIsStarted(true);
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
    });
  }

  function nextWord() {
    if (index < maxIndex) {
      let nIndex = index + 1;
      setIndex(nIndex);
      dispatch(updateFlashIndex(nIndex));
    } else {
      setGameIsFinish(true);
      dispatch(updateFlashFinish(true));
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
    if (lod_.isEmpty(flash)) {
      getThemesList();
    } else {
      initState();
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
      <Header
        title={`Party flash`}
        attributes={<div className="flash_score">{`Score : ${score}`}</div>}
      ></Header>

      <div className="gameContent">
        <div className="flash_gameContainer">
          {/* Before game screen */}
          {!isStarted && !gameIsFinish && (
            <Button onClick={startGame}>Commencer</Button>
          )}
          {/* In game screen */}
          {isStarted && !gameIsFinish && (
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
    </Layout>
  );
};
