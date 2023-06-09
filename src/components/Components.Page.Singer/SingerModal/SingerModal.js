import React, { useEffect, useRef } from "react";
import { MdOutlineClose } from "react-icons/md";
import ButtonIcon from "../../Components.Global/ButtonIcon/ButtonIcon";
import styles from "./SingerModal.module.scss";

function SingerModal({ data, setModal }) {
  const modalRef = useRef(null);
  const modalTextRef = useRef(null);
  const { image, name, desc } = data;

  const closeModal = () => {
    setModal(false);
  };

  const handleCloseModal = (e) => {
    if (e.target === modalRef.current) {
      setModal(false);
    }
  };

  useEffect(() => {
    modalTextRef.current.innerHTML = desc;
  }, [desc]);

  return (
    <div className={styles.modal} onClick={handleCloseModal} ref={modalRef}>
      <div className={styles.modalWrap}>
        <div className={styles.modalImg}>
          <div
            className={styles.bg}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
          <div className={styles.blur} />
          <div className={styles.img}>
            <img src={image} alt={name} />
            <h4>{name}</h4>
          </div>
          <div className={styles.btn}>
            <button className="" onClick={closeModal}>
              <ButtonIcon
                modal={true}
                popper={{ show: true, msg: "Đóng", position: "CenterUp" }}
              >
                <MdOutlineClose />
              </ButtonIcon>
            </button>
          </div>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.modalText} ref={modalTextRef}>
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingerModal;
