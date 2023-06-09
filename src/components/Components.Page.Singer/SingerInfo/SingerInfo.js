import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsPlayFill } from "react-icons/bs";
import styles from "./SingerInfo.module.scss";
import { actions } from "../../../store";
import PrimaryButton from "../../Components.Global/PrimaryButton/PrimaryButton";
import SingerModal from "../SingerModal/SingerModal";
import { ultils } from "../../../Share";

function SingerInfo({ data }) {
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);

  const { name, sortDesc, desc, topAlbum = {}, follow, image } = data;

  const { title, thumbnail: imageAb, releaseDate: dateAb } = topAlbum;

  const newFollow = ultils.getNumberText(follow);

  const handleModal = () => {
    setModal(true);
  };

  const handlePlaySingerSong = () => {
    dispatch(actions.playSinger());
  };
  return (
    <div className={styles.info}>
      <div className={styles.infoWrap}>
        <div className={styles.infoInfo}>
          <div className={styles.blurWrap}>
            <div
              className={styles.infoBlur}
              style={{
                backgroundImage:
                  'url("https://photo-resize-zmp3.zadn.vn/w360_r1x1_jpeg/avatars/4/a/9/1/4a91d506fc7144c7716b9d3166f2c4b6.jpg")',
              }}
            />
            <div className={styles.infoLayer} />
          </div>
          <div className={styles.inforWrap}>
            <div className={styles.inforContainer}>
              <div className={styles.infoLeft}>
                <h4>{name}</h4>
                <p className={styles.infoContent}>
                  {`${sortDesc}${desc ? "..." : ""} `}
                  {desc && <button onClick={handleModal}>xem thêm</button>}
                </p>

                <div className={styles.infoBtnWrap}>
                  <button onClick={handlePlaySingerSong}>
                    <PrimaryButton
                      info={{
                        msg: "phát nhạc",
                        mr: 10,
                      }}
                    >
                      <BsPlayFill />
                    </PrimaryButton>
                  </button>
                  <PrimaryButton
                    info={{
                      msg: "quan tâm",
                      bgGray: true,
                      mr: 20,
                    }}
                  >
                    <AiOutlineUserAdd />
                  </PrimaryButton>
                  <span>{newFollow} quan tâm</span>
                </div>
                <div className={styles.infoNewSong}>
                  {imageAb && (
                    <div className={styles.newSongLeft}>
                      <img src={imageAb} alt={title} className="is-60-px" />
                      <div className={styles.layer}></div>
                      <div className={styles.btn}>
                        <BsPlayFill />
                      </div>
                    </div>
                  )}

                  {title && (
                    <div className={styles.newSongRight}>
                      <h4>Mới nhất</h4>
                      <h3>{title}</h3>
                      <span>{dateAb}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.infoRight}>
                <img src={image} alt={name} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal ? (
        <SingerModal data={{ image, name, desc }} setModal={setModal} />
      ) : (
        ""
      )}
    </div>
  );
}

export default SingerInfo;
