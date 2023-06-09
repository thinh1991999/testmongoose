import React, { useEffect, useRef, useState } from "react";
import { GiAlarmClock } from "react-icons/gi";
import { BsThreeDots } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

import styles from "./Playlists.module.scss";
import { actions } from "../../../store";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import SongItem from "../SongItem/SongItem";

function Playlists() {
  const currentSong = useSelector((state) => state.song.currentSong);
  const listSong = useSelector((state) => state.song.listSong);
  const randomSong = useSelector((state) => state.song.randomSong);
  const showPlayLists = useSelector((state) => state.song.showPlayLists);
  const timeToStop = useSelector((state) => state.song.timeToStop);

  const [listCurrent, setListCurrent] = useState([]);
  const [listNext, setListNext] = useState([]);
  const options = useRef([
    {
      msg: "Xóa danh sách phát",
      icon: <IoTrashOutline />,
    },
  ]).current;
  const [showOption, setShowOption] = useState(false);
  const [mess, setMess] = useState("");

  const location = useLocation();

  const playListRef = useRef(null);

  const dispatch = useDispatch();

  const handleShowOption = () => {
    setShowOption(!showOption);
  };

  const handleRunOption = (index) => {
    switch (index) {
      case 0:
        dispatch(actions.clearPlayList());
        break;
      default:
        break;
    }
  };

  const handleShowTimeStop = () => {
    if (timeToStop > 0) {
      dispatch(
        actions.setWarningModal({
          show: true,
          type: "TIME",
        })
      );
    } else {
      dispatch(actions.setShowTimeStop(true));
    }
  };

  useEffect(() => {
    if (randomSong) {
      setListCurrent([currentSong]);
      const newListNext = listSong.filter((item) => {
        const { encodeId } = item;
        return encodeId !== currentSong?.encodeId;
      });
      setListNext(newListNext);
    } else {
      const newArrCurrent = [];
      const newArrNext = [];
      const currentIndex = listSong.findIndex((item) => {
        const { encodeId } = item;
        return encodeId === currentSong?.encodeId;
      });
      listSong.forEach((item, index) => {
        if (index <= currentIndex) {
          newArrCurrent.push(item);
        } else {
          newArrNext.push(item);
        }
      });
      setListCurrent(newArrCurrent);
      setListNext(newArrNext);
    }
  }, [listSong, randomSong, currentSong]);

  useEffect(() => {
    dispatch(actions.setShowPlayLists(false));
  }, [location, dispatch]);

  useEffect(() => {
    const eventClick = (e) => {
      if (!playListRef.current.contains(e.target)) {
        dispatch(actions.setShowPlayLists(false));
      }
    };
    const app_container = document.querySelector(".app__container");
    showPlayLists && app_container?.addEventListener("click", eventClick);
    return () => {
      app_container?.removeEventListener("click", eventClick);
    };
  }, [dispatch, showPlayLists]);

  useEffect(() => {
    if (timeToStop > 0) {
      setMess("Xóa hẹn giờ");
    } else {
      setMess("Hẹn giờ phát nhạc");
    }
  }, [timeToStop]);

  return (
    <div
      ref={playListRef}
      className={clsx(styles.playlist, showPlayLists && styles.playlistShow)}
    >
      <div className={styles.container}>
        <div className={styles.wrap}>
          <div className={styles.header}>
            <h2>Danh sách phát</h2>
            <button
              onClick={handleShowTimeStop}
              className={clsx(styles.btn, timeToStop > 0 ? styles.active : "")}
            >
              <ButtonIcon
                fill={true}
                popper={{
                  show: true,
                  msg: mess,
                  position: "CenterDownRight",
                }}
                player={true}
              >
                <GiAlarmClock />
              </ButtonIcon>
            </button>
            <button className={styles.btn} onClick={handleShowOption}>
              <ButtonIcon
                fill={true}
                popper={{
                  show: true,
                  msg: "Khác",
                  position: "CenterDown",
                }}
              >
                <BsThreeDots />
              </ButtonIcon>
              {showOption && (
                <div className={styles.options}>
                  <ul>
                    {options.map((option, index) => {
                      const { msg, icon } = option;
                      return (
                        <li key={index} onClick={() => handleRunOption(index)}>
                          {icon} {msg}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </button>
          </div>
          <div className={styles.body}>
            <div className={styles.past}>
              {listCurrent.map((item, index) => {
                const { encodeId, streamingStatus, isWorldWide } = item;
                if (encodeId !== currentSong?.encodeId) {
                  return (
                    <SongItem
                      key={encodeId}
                      status={streamingStatus}
                      worldWide={isWorldWide}
                      data={item}
                      index={index}
                      playLists={true}
                      blur={true}
                    />
                  );
                }

                return (
                  <SongItem
                    key={encodeId}
                    status={streamingStatus}
                    worldWide={isWorldWide}
                    data={item}
                    index={index}
                    playLists={true}
                  />
                );
              })}
            </div>
            <div className={styles.next}>
              <h3>Tiếp theo</h3>
              <span></span>
              {listNext.map((item, index) => {
                const { encodeId, streamingStatus, isWorldWide } = item;
                return (
                  <SongItem
                    key={encodeId}
                    status={streamingStatus}
                    worldWide={isWorldWide}
                    data={item}
                    index={index}
                    playLists={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlists;
