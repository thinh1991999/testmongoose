import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import "react-toastify/dist/ReactToastify.css";

import { auth, db } from "./firebase";

import {
  GlobalStyles,
  Lyric,
  GlobalLayout,
  CommentModal,
  LogInModal,
  WarningModal,
  SetTimeModal,
  Playlists,
  Player,
  TimeStopNote,
  MvModal,
  EventModal,
} from "./components";
import {
  Album,
  Error,
  Follow,
  Home,
  ListMV,
  NewSong,
  Profile,
  Radio,
  Search,
  SearchMobile,
  Singer,
  Top100,
  Type,
  TypeDetail,
  ZingChartPage,
  ZingChartWeek,
} from "./Pages";
import { actions } from "./store";

function App() {
  const location = useLocation();
  const { show: warningShow } = useSelector((state) => state.root.warningModal);
  const showLogin = useSelector((state) => state.root.showLogin);
  const showComment = useSelector((state) => state.root.showComment);

  const showEvent = useSelector((state) => state.event.showEvent);

  const currentSong = useSelector((state) => state.song.currentSong);
  const timeToStop = useSelector((state) => state.song.timeToStop);
  const showTimeStop = useSelector((state) => state.song.showTimeStop);

  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(actions.setLoginStatus(true));
        const userRef = ref(db, "users/" + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          dispatch(
            actions.setCurrentUser({ email: user.email, id: user.uid, ...data })
          );
        });
      } else {
        dispatch(actions.setLoginStatus(false));
        dispatch(actions.setCurrentUser(null));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!currentSong) {
      document.title = "ZingMp3-Nghe nhạc hay,chất lượng";
    }
  }, [currentSong]);

  useEffect(() => {
    dispatch(actions.setRouterHistory(location));
    dispatch(actions.setCurrentRouter(location.key));
  }, [location, dispatch]);

  return (
    <GlobalStyles>
      <div className="app theme-dark">
        <Routes>
          <Route
            path={"/"}
            element={
              <GlobalLayout>
                <Home />
              </GlobalLayout>
            }
          ></Route>

          <Route
            path={"/Album/:id"}
            element={
              <GlobalLayout>
                <Album />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/ZingChartHome"}
            element={
              <GlobalLayout>
                <ZingChartPage />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/ZingChartWeek"}
            element={
              <GlobalLayout>
                <ZingChartWeek />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/ZingChartWeek/:id"}
            element={
              <GlobalLayout>
                <ZingChartWeek />
              </GlobalLayout>
            }
          ></Route>

          <Route
            path={"/Radio"}
            element={
              <GlobalLayout>
                <Radio />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/Follow"}
            element={
              <GlobalLayout>
                <Follow />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/Type"}
            element={
              <GlobalLayout>
                <Type />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/TypeDetail/:id"}
            element={
              <GlobalLayout>
                <TypeDetail />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/Singer/:SingerName"}
            element={
              <GlobalLayout>
                <Singer />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/Top100"}
            element={
              <GlobalLayout>
                <Top100 />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/ListMV"}
            element={
              <GlobalLayout>
                <ListMV />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/NewSong"}
            element={
              <GlobalLayout>
                <NewSong />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/Search/:Keyword"}
            element={
              <GlobalLayout>
                <Search />
              </GlobalLayout>
            }
          ></Route>
          <Route
            path={"/Profile"}
            element={
              <GlobalLayout>
                <Profile />
              </GlobalLayout>
            }
          ></Route>
          <Route path={"/error"} element={<Error />}></Route>
          <Route path={"/*"} element={<Error />}></Route>

          <Route
            path={"/SearchMobile"}
            element={
              <GlobalLayout>
                <SearchMobile />
              </GlobalLayout>
            }
          ></Route>
        </Routes>
        <Lyric />
        <MvModal />
        {currentSong && <Player />}
        {currentSong && <Playlists />}
        {showTimeStop && <SetTimeModal />}
        {timeToStop > 0 && <TimeStopNote />}
        {warningShow && <WarningModal />}
        {showLogin && <LogInModal />}
        {showComment.show && <CommentModal />}
        {showEvent && <EventModal />}
      </div>
      <ToastContainer autoClose={3000} />
    </GlobalStyles>
  );
}
export default App;
