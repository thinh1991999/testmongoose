import { toast } from "react-toastify";
import { ultils } from "../../Share";

const infoStorage = () => {
  const data = JSON.parse(localStorage.getItem("infoCurrent"));
  if (typeof data !== "object" || data === null) {
    return {};
  }
  return data;
};

const getRandomIndex = (arr, index) => {
  const indexRD = Math.floor(Math.random() * (arr.length - 1));
  if (indexRD === index) {
    return getRandomIndex(arr, index);
  }
  return indexRD;
};

const getValidLastest = (arr = [], hint) => {
  let valid = false;
  arr.forEach((item) => {
    if (item.encodeId === hint.encodeId) {
      valid = true;
    }
  });
  return valid;
};

const initState = {
  playing: false,
  currentAlbum: infoStorage()["currentAlbum"] || "",
  album: {},
  listSong: infoStorage()["listSong"] || [],
  currentSong: null,
  randomSong: true,
  repeatSong: 0,
  songLoading: false,
  song: infoStorage()["song"] || {},
  songCurrentTime: infoStorage()["songCurrentTime"] || 0,
  fetchSong: false,
  showLyric: false,
  showPlayLists: false,
  invi: false,
  singer: {},
  currentSinger: infoStorage()["currentSinger"] || "",
  timeToStop: 0,
  showTimeStop: false,
};

export const SongReducer = (state = initState, { type, payLoad }) => {
  switch (type) {
    case "SET_ALBUM": {
      return {
        ...state,
        album: payLoad,
      };
    }
    case "SET_CURRENT_ALBUM": {
      return {
        ...state,
        currentAlbum: payLoad,
      };
    }
    case "SET_PLAYING": {
      return {
        ...state,
        playing: payLoad,
      };
    }
    case "SET_SONG": {
      return {
        ...state,
        song: payLoad,
      };
    }
    case "SET_SONG_LOADING": {
      return {
        ...state,
        songLoading: payLoad,
      };
    }
    case "SET_SONG_CURRENT_TIME": {
      return {
        ...state,
        songCurrentTime: payLoad,
      };
    }
    case "SET_REPEAT_SONG": {
      return {
        ...state,
        repeatSong: payLoad,
      };
    }
    case "SET_RANDOM_SONG": {
      return {
        ...state,
        randomSong: payLoad,
      };
    }

    case "SET_SHOW_LYRIC": {
      return {
        ...state,
        showLyric: payLoad,
        showPlayLists: false,
      };
    }
    case "SET_SHOW_TIME_STOP": {
      return {
        ...state,
        showTimeStop: payLoad,
      };
    }
    case "SET_SHOW_PLAY_LISTS": {
      return {
        ...state,
        showPlayLists: payLoad,
      };
    }
    case "CLEAR_PLAY_LIST": {
      return {
        ...state,
        listSong: [],
        currentAlbum: "",
        currentSong: null,
        playing: false,
        songCurrentTime: 0,
      };
    }
    case "SET_FETCH_SONG": {
      return {
        ...state,
        fetchSong: payLoad,
      };
    }
    case "SET_SINGER": {
      return {
        ...state,
        singer: Object.assign({}, payLoad),
      };
    }
    case "SET_CURRENT_SINGER": {
      return {
        ...state,
        currentSinger: payLoad,
      };
    }

    case "PLAY_SONG_SAME_SINGER": {
      const { indexValidSongs, listSong } = state;

      const indexCurrent = listSong.findIndex(
        (item) => item.encodeId === payLoad
      );

      if (indexValidSongs.includes(payLoad)) {
        return {
          ...state,
          idCurrentSong: payLoad,
          currentSong: listSong.filter((item) => item.encodeId === payLoad)[0],
          currentIndexSong: indexCurrent,
          fetchSong: true,
        };
      } else {
        toast.error("Bài hát này chưa được hỗ trợ!");
        return {
          ...state,
        };
      }
    }

    case "PLAY_SONG_ANOTHER_CHART_HOME": {
      const { id, album, items } = payLoad;
      const indexArr = [];
      items.forEach((item) => {
        const { encodeId, streamingStatus: statusSong } = item;
        if (statusSong === 1) {
          indexArr.push(encodeId);
        }
      });
      if (indexArr.includes(id)) {
        const newIndex = items.findIndex((item) => item.encodeId === id);
        const newSong = items.filter((item) => {
          const { encodeId } = item;
          return encodeId === id;
        })[0];
        return {
          ...state,
          currentAlbum: album,
          indexValidSongs: indexArr,
          idCurrentSong: id,
          listSong: items,
          currentIndexSong: newIndex,
          currentSong: newSong,
          fetchSong: true,
          // showLyric: true,
          currentSinger: "",
        };
      } else {
        toast.error("Bài hát này chưa được hỗ trợ!");
        return {
          ...state,
        };
      }
    }
    case "SET_SONG_CURRENT_INFO": {
      return {
        ...state,
        currentSong: payLoad,
      };
    }
    case "SET_LIST_SONG": {
      const { idCurrentSong } = state;
      const indexArr = [];
      payLoad.forEach((item) => {
        const { encodeId, streamingStatus: statusSong } = item;
        if (statusSong === 1) {
          indexArr.push(encodeId);
        }
      });
      const newIndex = payLoad.findIndex((item) => {
        const { encodeId } = item;
        return encodeId === idCurrentSong;
      });
      return {
        ...state,
        indexValidSongs: indexArr,
        listSong: payLoad,
        currentIndexSong: newIndex,
      };
    }
    case "PLAY_NEXT_SONG_AUTO": {
      const {
        repeatSong,
        randomSong,
        indexValidSongs,
        currentIndexSong,
        listSong,
        idCurrentSong,
      } = state;
      if (repeatSong === 1) {
        const newSong = listSong.filter((item) => {
          const { encodeId } = item;
          return encodeId === idCurrentSong;
        })[0];

        const newIndex = listSong.findIndex((item) => {
          const { encodeId } = item;
          return encodeId === idCurrentSong;
        });

        return {
          ...state,
          idCurrentSong: idCurrentSong,
          currentSong: newSong,
          currentIndexSong: newIndex,
          fetchSong: true,
        };
      } else {
        if (randomSong) {
          const indexRd = getRandomIndex(indexValidSongs, currentIndexSong);

          const newSong = listSong.filter((item) => {
            const { encodeId } = item;
            return encodeId === indexValidSongs[indexRd];
          })[0];

          const newIndex = listSong.findIndex((item) => {
            const { encodeId } = item;
            return encodeId === indexValidSongs[indexRd];
          });

          return {
            ...state,
            currentSong: newSong,
            currentIndexSong: newIndex,
            idCurrentSong: indexValidSongs[indexRd],
            fetchSong: true,
          };
        } else {
          const currentIndex = indexValidSongs.findIndex(
            (item) => item === idCurrentSong
          );

          if (currentIndex === indexValidSongs.length - 1) {
            if (repeatSong === 0) {
              return {
                ...state,
                playing: false,
              };
            }
            if (repeatSong === 2) {
              const newSong = listSong.filter((item) => {
                const { encodeId } = item;
                return encodeId === indexValidSongs[0];
              })[0];

              const newIndex = listSong.findIndex((item) => {
                const { encodeId } = item;
                return encodeId === indexValidSongs[0];
              });

              return {
                ...state,
                currentSong: newSong,
                currentIndexSong: newIndex,
                idCurrentSong: indexValidSongs[0],
                fetchSong: true,
              };
            }
          } else {
            const newSong = listSong.filter((item) => {
              const { encodeId } = item;
              return encodeId === indexValidSongs[currentIndex + 1];
            })[0];

            const newIndex = listSong.findIndex((item) => {
              const { encodeId } = item;
              return encodeId === indexValidSongs[currentIndex + 1];
            });

            return {
              ...state,
              currentSong: newSong,
              currentIndexSong: newIndex,
              fetchSong: true,
              idCurrentSong: indexValidSongs[currentIndex + 1],
            };
          }
        }
      }
      break;
    }
    case "PLAY_NEXT_SONG": {
      const {
        randomSong,
        currentIndexSong,
        indexValidSongs,
        listSong,
        repeatSong,
        idCurrentSong,
      } = state;
      if (randomSong) {
        const indexRd = getRandomIndex(indexValidSongs, currentIndexSong);
        const newSong = listSong.filter((item) => {
          const { encodeId } = item;
          return encodeId === indexValidSongs[indexRd];
        })[0];

        const newIndex = listSong.findIndex((item) => {
          const { encodeId } = item;
          return encodeId === indexValidSongs[indexRd];
        });

        return {
          ...state,
          currentSong: newSong,
          currentIndexSong: newIndex,
          fetchSong: true,
          idCurrentSong: indexValidSongs[indexRd],
        };
      } else {
        const currentIndex = indexValidSongs.findIndex(
          (item) => item === idCurrentSong
        );
        if (currentIndex === indexValidSongs.length - 1) {
          const song = listSong.filter((item) => {
            const { encodeId } = item;
            return encodeId === indexValidSongs[0];
          })[0];

          const newIndex = listSong.findIndex((item) => {
            const { encodeId } = item;
            return encodeId === indexValidSongs[0];
          });

          if (repeatSong === 1) {
            return {
              ...state,
              currentSong: song,
              currentIndexSong: newIndex,
              fetchSong: true,
              repeatSong: 0,
              idCurrentSong: indexValidSongs[0],
            };
          } else {
            return {
              ...state,
              currentSong: song,
              currentIndexSong: newIndex,
              fetchSong: true,
              idCurrentSong: indexValidSongs[0],
            };
          }
        } else {
          const song = listSong.filter((item) => {
            const { encodeId } = item;
            return encodeId === indexValidSongs[currentIndex + 1];
          })[0];

          const newIndex = listSong.findIndex((item) => {
            const { encodeId } = item;
            return encodeId === indexValidSongs[currentIndex + 1];
          });

          if (repeatSong === 1) {
            return {
              ...state,
              currentSong: song,
              currentIndexSong: newIndex,
              fetchSong: true,
              repeatSong: 0,
              idCurrentSong: indexValidSongs[currentIndex + 1],
            };
          }
          return {
            ...state,
            currentSong: song,
            currentIndexSong: newIndex,
            fetchSong: true,
            idCurrentSong: indexValidSongs[currentIndex + 1],
          };
        }
      }
    }
    case "PLAY_BACK_SONG": {
      const {
        randomSong,
        currentIndexSong,
        indexValidSongs,
        listSong,
        repeatSong,
        idCurrentSong,
      } = state;
      if (randomSong) {
        const indexRd = getRandomIndex(indexValidSongs, currentIndexSong);
        const newSong = listSong.filter((item) => {
          const { encodeId } = item;
          return encodeId === indexValidSongs[indexRd];
        })[0];

        const newIndex = listSong.findIndex((item) => {
          const { encodeId } = item;
          return encodeId === indexValidSongs[indexRd];
        });

        if (repeatSong === 1) {
          return {
            ...state,
            currentSong: newSong,
            currentIndexSong: newIndex,
            fetchSong: true,
            repeatSong: 0,
            idCurrentSong: indexValidSongs[indexRd],
          };
        }
        return {
          ...state,
          currentSong: newSong,
          currentIndexSong: newIndex,
          fetchSong: true,
          idCurrentSong: indexValidSongs[indexRd],
        };
      } else {
        const currentIndex = indexValidSongs.findIndex(
          (item) => item === idCurrentSong
        );

        const newSong = listSong.filter((item) => {
          const { encodeId } = item;
          return encodeId === indexValidSongs[currentIndex - 1];
        })[0];

        const newIndex = listSong.findIndex((item) => {
          const { encodeId } = item;
          return encodeId === indexValidSongs[currentIndex - 1];
        });

        if (repeatSong === 1) {
          return {
            ...state,
            currentSong: newSong,
            currentIndexSong: newIndex,
            fetchSong: true,
            repeatSong: 0,
            idCurrentSong: indexValidSongs[currentIndex - 1],
          };
        }
        return {
          ...state,
          currentSong: newSong,
          currentIndexSong: newIndex,
          fetchSong: true,
          idCurrentSong: indexValidSongs[currentIndex - 1],
        };
      }
    }
    case "PLAY_ALBUM": {
      const { album, currentSong, lastest } = state;
      const {
        encodeId,
        song: { items },
      } = album;
      const validArr = ultils.getListValidIdxSong(items);
      if (validArr.length === 0) {
        toast.error("Album này không có bài hát được hỗ trợ");
        return {
          ...state,
        };
      }
      const newSongInfoRD = ultils.getRandomSong(items, currentSong);
      return {
        ...state,
        currentSong: newSongInfoRD,
        currentAlbum: encodeId,
        listSong: items,
        showLyric: true,
        fetchSong: true,
        randomSong: true,
      };
    }
    case "PLAY_SONG_SAME_ALBUM": {
      return {
        ...state,
        currentSong: payLoad,
        fetchSong: true,
      };
    }
    case "PLAY_SONG_ANOTHER_ALBUM": {
      const { lastest, album } = state;
      const {
        encodeId,
        song: { items },
      } = album;

      return {
        ...state,
        currentAlbum: encodeId,
        listSong: items,
        currentSong: payLoad,
        fetchSong: true,
        showLyric: true,
        currentSinger: "",
      };
    }
    case "PLAY_NEW_SONG": {
      const { songInfo, album: albumId, items } = payLoad;
      return {
        ...state,
        currentAlbum: albumId,
        currentSong: songInfo,
        listSong: items,
        fetchSong: true,
        currentSinger: "",
      };
    }
    case "PLAY_SEARCH_SONG": {
      const { album: albumId, items } = payLoad;
      return {
        ...state,
        currentAlbum: albumId,
        listSong: items,
        currentSinger: "",
      };
    }
    case "PLAY_SINGER": {
      const { singer } = state;
      const newListSong = Array.from([...singer.sections[0].items]);
      const indexArrValid = ultils.getListValidIdxSong(newListSong);
      if (indexArrValid.length === 0) {
        toast.error("List nhạc không có bài được hỗ trợ");
        return {
          ...state,
        };
      }
      const newSong = ultils.getRandomSong(newListSong);
      return {
        ...state,
        currentSong: newSong,
        currentAlbum: newSong.album?.encodeId || null,
        listSong: newListSong,
        fetchSong: true,
        randomSong: true,
      };
    }
    case "PLAY_SONG_ANOTHER_SINGER": {
      const { singer } = state;
      const newListSong = Array.from([...singer.sections[0].items]);
      return {
        ...state,
        currentAlbum: payLoad?.album?.encodeId || null,
        listSong: newListSong,
        currentSong: payLoad,
        fetchSong: true,
      };
    }
    case "SET_TIME_TO_STOP": {
      return {
        ...state,
        timeToStop: payLoad,
      };
    }
    case "PLAY_SONG_AFTER_FETCH": {
      return {
        ...state,
        songCurrentTime: 0,
        song: payLoad,
        songLoading: false,
        playing: true,
        fetchSong: false,
      };
    }
    default:
      return {
        ...state,
      };
  }
};