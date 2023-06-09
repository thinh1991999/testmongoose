import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { AiOutlineSearch, AiOutlineMenu } from "react-icons/ai";
// import { FiSettings } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import clsx from "clsx";

import HeaderButton from "../HeaderButton/HeaderButton";
import HeaderFormSuggest from "../HeaderFormSuggest/HeaderFormSuggest";
import styles from "./Header.module.scss";
import { actions } from "../../../store";
import HttpService from "../../../Services/http.service";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    blackHeader,
    activeSearch,
    currentUser,
    currentRouter,
    routerHistory,
  } = useSelector((state) => state.root);

  const [searchText, setSearchText] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const suggest = useRef([
    "vui lắm nha",
    "thương em đến",
    "em đừng đi",
    "zing choice",
  ]).current;
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const btnMobileRef = useRef(null);

  const checkIdxRouter = useMemo(() => {
    const idx = routerHistory.findIndex((item) => {
      return item.key === currentRouter;
    });
    return idx;
  }, [currentRouter, routerHistory]);

  const handlePrevPage = () => {
    if (checkIdxRouter > 0) navigate(-1);
  };

  const handleNextPage = () => {
    if (checkIdxRouter < routerHistory.length - 1) navigate(+1);
  };

  const handleSearchForm = () => {
    dispatch(actions.setActiveSearch(true));
  };

  const handleLogin = () => {
    if (currentUser) {
      navigate("/Profile");
    } else {
      dispatch(actions.setShowLogin(true));
      dispatch(actions.setShowNavMobile(false));
    }
  };

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText.length > 0) {
      navigate(`/Search/${searchText}`);
      dispatch(actions.setActiveSearch(false));
      inputRef.current.blur();
    }
  };

  const handleSubmitBtn = () => {
    if (searchText.length > 0) {
      navigate(`/Search/${searchText}`);
      dispatch(actions.setActiveSearch(false));
      inputRef.current.blur();
    }
  };

  const handleDeleteSearchText = () => {
    setSearchText("");
    setDataSearch([]);
    inputRef.current.focus();
  };

  useEffect(() => {
    const event = (e) => {
      if (!formRef.current.contains(e.target)) {
        dispatch(actions.setActiveSearch(false));
      }
    };
    activeSearch && window.addEventListener("click", event);
    return () => {
      window.removeEventListener("click", event);
    };
  }, [dispatch, activeSearch]);

  useEffect(() => {
    let searchDelay;
    let isApiSubcribed = true;
    if (searchText.trim().length > 0) {
      setLoading(true);
      searchDelay = setTimeout(() => {
        HttpService.getSearch(searchText).then((res) => {
          if (isApiSubcribed) {
            const {
              data: { artists = [], songs = [], top },
            } = res.data;
            setDataSearch([
              top,
              ...artists.splice(0, 2),
              ...songs.splice(0, 3),
            ]);
            setLoading(false);
          }
        });
      }, 100);
      return () => {
        isApiSubcribed = false;
        clearTimeout(searchDelay);
      };
    }
  }, [searchText]);

  const headerBg = blackHeader ? styles.headerBg : "";

  const finalClass = clsx(styles.features, headerBg);

  return (
    <header className={finalClass}>
      <div className={styles.featuresLeft}>
        <div className={styles.featuresLeftBtn}>
          <button
            className={styles.menuBtn}
            ref={btnMobileRef}
            onClick={() => dispatch(actions.setShowNavMobile(true))}
          >
            <HeaderButton>
              <AiOutlineMenu />
            </HeaderButton>
          </button>
          <button className={styles.leftBtn} onClick={handlePrevPage}>
            <HeaderButton disable={checkIdxRouter === 0}>
              <HiOutlineArrowLeft />
            </HeaderButton>
          </button>
          <button className={styles.rightBtn} onClick={handleNextPage}>
            <HeaderButton disable={checkIdxRouter >= routerHistory.length - 1}>
              <HiOutlineArrowRight />
            </HeaderButton>
          </button>
        </div>
        <form
          className={clsx(styles.form, activeSearch && styles.formActive)}
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className={styles.formContainer}>
            <div className={styles.formIcon} onClick={handleSubmitBtn}>
              <AiOutlineSearch />
            </div>
            <div className={styles.formInput}>
              <input
                type="text"
                placeholder="Nhập tên bài hát,nghệ sĩ,MV,...."
                value={searchText}
                onFocus={handleSearchForm}
                onChange={handleSearchText}
                ref={inputRef}
              />
            </div>
            <div
              className={clsx(
                styles.formIconRight,
                searchText.length > 0 && styles.formIconRightActive
              )}
              onClick={handleDeleteSearchText}
              ref={deleteBtnRef}
            >
              <MdOutlineClose />
            </div>
            {activeSearch && (
              <HeaderFormSuggest
                data={dataSearch}
                suggest={suggest}
                searchText={searchText}
                loading={loading}
                setSearchText={setSearchText}
              />
            )}
          </div>
        </form>
        <div className={styles.searchMobile}>
          <Link to={"/SearchMobile"}>
            <AiOutlineSearch />
          </Link>
        </div>
      </div>
      <div className={styles.featuresRight}>
        {/* <button onClick={() => toast.error("Chức năng này chưa được hỗ trợ")}>
          <HeaderButton circle={true}>
            <FiSettings />
          </HeaderButton>
        </button> */}
        <button onClick={handleLogin}>
          <HeaderButton circle={true} white={true}>
            {currentUser ? (
              <img src={currentUser.profile_picture} alt="" />
            ) : (
              <FaUserAlt />
            )}
          </HeaderButton>
        </button>
      </div>
    </header>
  );
}

export default Header;
